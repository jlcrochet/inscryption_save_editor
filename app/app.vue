<template>
  <main style="margin: 1em">
    <h1>Inscryption Save Editor</h1>

    <noscript>WARNING: This page doesn't work without JavaScript. Please enable JavaScript in your browser and refresh the page.</noscript>

    <dialog ref=dialogRef @click=closeDialogOnBackdrop>
      <article>
        <header>
          <p><strong>Instructions</strong></p>
        </header>

        <p>Read the following before use:</p>

        <ul>
          <li>Make sure that you keep a backup of your original save file before experimenting.</li>
          <li>Avoid making manual changes to your save file before uploading; doing so may cause errors.</li>
          <li>Some cards and sigils may cause errors if played outside of specific contexts; others may do nothing at all.</li>
        </ul>

        <p>To report problems, e-mail me at <a :href='`mailto:${email}`'>{{ email }}</a> or post an issue on <a :href=repo target=_blank>GitHub</a>.</p>

        <p>Steps:</p>

        <ol>
          <li>
            Click the Choose File button to upload your save file from your Inscryption directory.
            <ul>
              <li>If you are using the Steam version of the game, the save file is located in <code>steamapps\common\Inscryption\SaveFile.gwsave</code> relative to your Steam directory which &mdash; on Windows &mdash; is typically located at <code>%ProgramFiles%\Steam</code>.</li>
              <li>If you are using XBox Game Pass on Windows, the save file should be located at <code>%LocalAppData%\Packages\DevolverDigital.Inscryption_xxxxxx</code> where <code>xxxxxx</code> is a string of digits. See <a :href='`${repo}/issues/23#issuecomment-3172873199`' target=_blank>this comment</a> for more details.</li>
              <li>This editor can also edit save files from some other platforms like Nintendo Switch.</li>
              <li>If you want this editor to support save files in other formats, please send me an example save file and I'll see what I can do.</li>
            </ul>
          </li>
          <li>A form will appear on the page; use it to make changes to your save file.</li>
          <li>After making changes, click the Save button at the bottom of the page; this will create a new file and will prompt you to save it.</li>
          <li>Save the new file to your Inscryption directory.</li>
          <li>After loading the new save file into Inscryption, the game might take a bit longer than usual to start; this is normal and should only happen once.</li>
        </ol>
      </article>

      <button @click="dialogRef.close()">Close</button>
    </dialog>

    <dialog ref=errorDialogRef @click=closeErrorDialogOnBackdrop>
      <article>
        <header>
          <p><strong>Error</strong></p>
        </header>

        <p>An unexpected error occurred. Please e-mail me at <a :href='`mailto:${email}`'>{{ email }}</a> or post an issue on <a :href=repo target=_blank>GitHub</a> and I will try to troubleshoot the issue. Please remember to provide the save file that is having issues.</p>

        <p>To assist in troubleshooting the issue, you may also copy the below error and include it in your report:</p>

        <pre><code>{{ errorText }}</code></pre>
      </article>

      <div class=error-actions>
        <button type=button @click=copyError>Copy Error</button>
        <button type=button @click="errorDialogRef.close()">Close</button>
      </div>
    </dialog>

    <p>
      <button class="outline" @click="dialogRef.showModal()">Instructions</button>
    </p>

    <p>
      <input type=file @click="$event.target.value = null" @input=parseFile($event.target.files[0])>
    </p>

    <template v-if=loading>
      <p>
        <progress />
      </p>
    </template>

    <template v-else-if=saveFile>
      <form name=main @submit.prevent=createFile>
        <tabs>
          <tab title="Global">
            <forms-global />
          </tab>
          <tab title="Act I">
            <forms-act-i />
          </tab>
          <tab title="Act II">
            <forms-act-ii />
          </tab>
          <tab title="Act III">
            <forms-act-iii />
          </tab>
          <tab title="Finale">
            <forms-finale />
          </tab>

          <template v-if=saveFile.ascensionData>
            <tab title="Kaycee's Mod">
              <template v-if=saveFile.ascensionData?.currentRun>
                <forms-kmod />
              </template>
              <template v-else>
                <forms-kmod-no-run />
              </template>
            </tab>
          </template>
        </tabs>

        <p>
          <label title="If the file is currently in console format, it will be translated to PC format; if it is currently in PC format it will be translated to console format. When in doubt, leave this unchecked.">
            <template v-if=consoleFormat>
              Change file to PC format
            </template>
            <template v-else>
              Change file to console format
            </template>
            <input type=checkbox v-model=switchFormat>
          </label>
        </p>

        <p>
          <input type=submit value=Save>
        </p>
      </form>
    </template>
  </main>

  <a ref=anchorRef hidden />
</template>

<script setup lang=ts>
  const email = 'jlcrochet91@pm.me'
  const repo = 'https://github.com/jlcrochet/inscryption_save_editor'

  const saveFile = ref(null)
  provide('saveFile', saveFile)

  const anchorRef = ref(null)
  const dialogRef = ref<HTMLDialogElement | null>(null)
  const errorDialogRef = ref<HTMLDialogElement | null>(null)

  const loading = ref(false)
  const consoleFormat = ref(false)
  const switchFormat = ref(false)
  const errorText = ref('')

  const VISITED_KEY = 'inscryption-save-editor-visited'

  onMounted(() => {
    if (!localStorage.getItem(VISITED_KEY)) {
      dialogRef.value?.showModal()
      localStorage.setItem(VISITED_KEY, '1')
    }
  })

  function closeDialogOnBackdrop(event: MouseEvent) {
    if (event.target === dialogRef.value) {
      dialogRef.value?.close()
    }
  }

  function closeErrorDialogOnBackdrop(event: MouseEvent) {
    if (event.target === errorDialogRef.value) {
      errorDialogRef.value?.close()
    }
  }

  function copyError() {
    navigator.clipboard.writeText(errorText.value)
  }

  // This seems to be a commonly used header, but I currently don't know
  // if it works for all platforms:
  const standardConsoleHeader = Uint8Array.of(0,1,0,0,0,255,255,255,255,1,0,0,0,0,0,0,0,6,1,0,0,0)

  const utf8 = {
    encoder: new TextEncoder(),
    decoder: new TextDecoder(),
    encode(text: string): Uint8Array { return this.encoder.encode(text) },
    decode(bytes: Uint8Array): string { return this.decoder.decode(bytes) }
  }

  let fileName: string
  let header: Uint8Array | null
  let fs: any
  let fsSaveFileIndex: number

  async function parseFile(file: File) {
    try {
      loading.value = true
      fs = null

      console.log(file)
      fileName = file.name
      const bytes = new Uint8Array(await file.arrayBuffer())

      let body: Uint8Array

      if (bytes.at(0) == 0x00 && bytes.at(-1) == 0x0B /* vertical tab */) {
        consoleFormat.value = true
        const [h, b] = parseBody(bytes)
        header = h
        body = b
      }
      else if (bytes.at(0) == 0x7B /* { */) {
        let i = 1
        while (bytes.at(i) <= 0x20 /* whitespace */) i += 1

        if (utf8.decode(bytes.slice(i, i + 8)) == '"_files"') {
          consoleFormat.value = true
          const json = utf8.decode(bytes)
          fs = JSON.parse(json)
          fsSaveFileIndex = fs._files.findIndex(f => f._fullPath == '/SaveFile.gwsave')
          const [h, b] = parseBody(Uint8Array.from(fs._files[fsSaveFileIndex]._data))
          header = h
          body = b
        }
        else {
          consoleFormat.value = false
          header = null
          body = bytes
        }
      }
      else {
        throw 'Unrecognized file format'
      }

      body = normalizeJSON(body)

      const text = utf8.decode(body)

      const nodes: object[] = []
      const types: string[] = []

      const data = JSON.parse(text, function(key: string, value: any): any {
        switch (key) {
          case "$id":
            nodes.push(this)
            break
          case "$type":
            if (typeof value == "number") {
              return types[value]
            } else {
              const type = value.substring(value.indexOf('|') + 1)
              types.push(type)
              return type
            }
          default:
            if (typeof value == "string" && value.startsWith("$iref:")) {
              const n = parseInt(value.substring(6))
              return nodes[n]
            }
        }

        return value
      })

      // function normalizeCardModInfo(deck) {
      //   // Normalize the card mod info list:

      //   // 1. Ensure that all mod info keys are in the format `[name]#[index]`.
      //   // for (const modInfo of deck.cardIdModInfos.$rcontent) {
      //   //   if (!modInfo.$k.includes('#'))
      //   //     modInfo.$k += "#0"
      //   // }

      //   // 2. Ensure that the mod info list is cowitnessed with the card list for easier lookups.
      //   // We can remove the `#[index]` at this point.
      //   deck.cardIdModInfos.$rcontent.sort((a, b) => {
      //     let [aName, aIdx] = a.$k.split('#', 2)
      //     let [bName, bIdx] = b.$k.split('#', 2)
      //     if (aName != bName) return 0
      //     aIdx = parseInt(aIdx) || 0
      //     bIdx = parseInt(bIdx) || 0
      //   })

      //   // const tally = {}
      //   // deck.cardIdModInfos.$rcontent = deck.cardIds.$rcontent.map(name => {
      //   //   tally[name] ??= 0
      //   //   const search = name + "#" + tally[name]++
      //   //   const target = deck.cardIdModInfos.$rcontent.find(modInfo => modInfo.$k == search)
      //   // })
      // }

      // normalizeCardModInfo(data.currentRun.playerDeck)
      // normalizeCardModInfo(data.gbcData.deck)
      // normalizeCardModInfo(data.part3Data.deck)
      // normalizeCardModInfo(data.grimoraData.deck)
      // if (data.ascensionData?.currentRun)
      //   normalizeCardModInfo(data.ascensionData.currentRun.playerDeck)

      // Stub boon arrays if they don't already exist:
      data.currentRun.playerDeck.boonIds ??= listNew("DiskCardGame.BoonData+Type")
      if (data.ascensionData?.currentRun)
        data.ascensionData.currentRun.playerDeck.boonIds ??= listNew("DiskCardGame.BoonData+Type")

      saveFile.value = data
    }
    catch (error) {
      errorHandler(error)
    }

    loading.value = false
  }

  function createFile() {
    try {
      // function normalizeModInfoKeys(deck) {
      //   for (const name of deck.cardIds) {
      //     const search = name + "#"
      //     let idx = 0

      //     for (const modInfo of deck.cardIdModInfos.$rcontent) {
      //       if (modInfo.$k == name || modInfo.$k.startsWith(search)) {
      //         modInfo.$k = search + idx++
      //       }
      //     }
      //   }
      // }

      // normalizeModInfoKeys(saveFile.value.currentRun.playerDeck)
      // normalizeModInfoKeys(saveFile.value.gbcData.deck)
      // normalizeModInfoKeys(saveFile.value.part3Data.deck)
      // normalizeModInfoKeys(saveFile.value.grimoraData.deck)
      // if (saveFile.value.ascensionData?.currentRun)
      //   normalizeModInfoKeys(saveFile.value.ascensionData.currentRun.playerDeck)

      const body = JSON.stringify(saveFile.value)

      let outputAsConsoleFormat = consoleFormat.value
      if (switchFormat.value) outputAsConsoleFormat = !outputAsConsoleFormat

      let blobParts: any[]

      if (outputAsConsoleFormat) {
        header ??= standardConsoleHeader

        if (fs) {
          const payload = [
            ...header,
            ...vlq(body.length),
            ...utf8.encode(body),
            0x0B  // vertical tab; used to indicate EOF
          ]
          fs._files[fsSaveFileIndex]._data = payload
          blobParts = [JSON.stringify(fs)]
        } else {
          blobParts = [header, vlq(body.length), body, Uint8Array.of(0x0B)]
        }
      } else {
        blobParts = [body]
      }

      const blob = new Blob(blobParts)
      const url = URL.createObjectURL(blob)

      anchorRef.value.href = url
      anchorRef.value.download = fileName
      anchorRef.value.click()
      URL.revokeObjectURL(url)
    }
    catch (error) {
      errorHandler(error)
    }
  }

  function parseBody(bytes: Uint8Array): [Uint8Array, Uint8Array] {
    const header = bytes.slice(0, 22)

    // Skip VLQ
    let start = 22
    while (bytes[start] > 0x7F) start += 1
    start += 1

    const body = bytes.slice(start, -1)

    return [header, body]
  }

  function vlq(n: number): Uint8Array {
    const size = Math.ceil(Math.log2(n + 1) / 7)
    const output = new Uint8Array(size)

    let i = 0

    while (n > 0) {
      let septet = n & 0x7F
      n >>= 7
      if (n > 0) septet |= 1 << 7
      output[i++] = septet
    }

    return output
  }

  // Strips redundant whitespace, wraps `$iref` in quotes, and replaces
  // Unity-style vectors with JSON-compatible ones
  function normalizeJSON(bytes: Uint8Array): Uint8Array {
    const output: number[] = []
    const regions: string[] = []

    let coordinateX = true
    let isKey = true

    for (let i = 0; i < bytes.length; i += 1) {
      let b = bytes[i]

      if (b <= 0x20 /* whitespace */) {
        if (regions.at(-1) == 'string')
          output.push(b)
      }
      else if (b == 0x22 /* " */) {
        if (regions.at(-1) == 'string')
          regions.pop()
        else
          regions.push('string')

        output.push(b)
      }
      else if (b == 0x2D || (b >= 0x30 && b <= 0x39) /* - or digits */) {
        if (regions.at(-1) == 'object' && isKey) {
          output.push(0x22, (coordinateX ? 0x78 : 0x79), 0x22, 0x3A)  // "x|y":
          coordinateX = !coordinateX

          while (b == 0x2D || b == 0x2E || (b >= 0x30 && b <= 0x39) || b == 0x45 /* - or . or digits or E for exponents */) {
            output.push(b)
            b = bytes[++i]
          }

          i -= 1
        }
        else {
          output.push(b)
        }
      }
      else if (b == 0x3A /* : */) {
        if (regions.at(-1) == 'object')
          isKey = false
        output.push(b)
      }
      else if (b == 0x5B /* [ */) {
        if (regions.at(-1) != 'string')
          regions.push('array')
        output.push(b)
      }
      else if (b == 0x7B /* { */) {
        if (regions.at(-1) != 'string')
          regions.push('object')
        output.push(b)
      }
      else if (b == 0x5D /* ] */) {
        if (regions.at(-1) == 'array')
          regions.pop()
        output.push(b)
      }
      else if (b == 0x7D /* } */) {
        if (regions.at(-1) == 'object') {
          regions.pop()
          isKey = true
        }
        output.push(b)
      }
      else if (b == 0x2C /* , */) {
        if (regions.at(-1) == 'object')
          isKey = true
        output.push(b)
      }
      else if (b == 0x24 /* $ */) {
        if (regions.at(-1) == 'string') {
          output.push(b)
        }
        else {
          output.push(0x22)
          while (b > 0x20 && b != 0x2C && b != 0x5D && b != 0x7D /* [^[:space:],\]}] */) {
            output.push(b)
            b = bytes[++i]
          }
          i -= 1
          output.push(0x22)
        }
      }
      else {
        output.push(b)
      }
    }

    return Uint8Array.from(output)
  }

  function errorHandler(error: Error) {
    console.error(error)
    errorText.value = error instanceof Error ? (error.stack || `${error.name}: ${error.message}`) : String(error)
    errorDialogRef.value?.showModal()
  }
</script>
