<template>
  <div style="margin: 1em">
    <h1>Inscryption Save Editor</h1>

    <noscript>WARNING: This page doesn't work without JavaScript. Please enable JavaScript in your browser and refresh the page.</noscript>

    <blockquote>
      <p>NOTE: Spoilers ahead if you haven't beaten the game yet.</p>

      <p>Read the following before use:</p>

      <ul>
        <li>Make sure that you keep a backup of your original save file before experimenting.</li>
        <li>Avoid making manual changes to your save file before uploading; doing so may cause errors.</li>
        <li>Some cards and sigils may cause errors if played outside of specific contexts; others may do nothing at all.</li>
      </ul>

      <p>To report problems, e-mail me at <a :href='`mailto:${email}`'>{{ email }}</a> or post an issue on <a :href=repo target=_blank>GitHub</a>.</p>

      <p>Instructions:</p>

      <ol>
        <li>
          Click the button below to upload your save file from your Inscryption directory.
          <ul>
            <li>If you are using the Steam version of the game, the save file is located in <code>steamapps\common\Inscryption\SaveFile.gwsave</code> relative to your Steam directory which &mdash; on Windows &mdash; is typically located at <code>%ProgramFiles%\Steam</code>.</li>
            <li>If you are using XBox Game Pass on Windows, the save file should be located at <code>%LocalAppData%\Packages\DevolverDigital.Inscryption_xxxxxx</code> where <code>xxxxxx</code> is a string of digits. See <a :href='`${repo}/issues/23#issuecomment-3172873199`' target=_blank>this comment</a> for more details.</li>
            <li>This editor can also edit save files from some other platforms like Nintendo Switch and XBox Game Pass.</li>
            <li>If you want this editor to support save files in other formats, please send me an example save file and I'll see what I can do.</li>
          </ul>
        </li>
        <li>A form will appear on the page; use it to make changes to your save file.</li>
        <li>After making changes, click the Save button at the bottom of the page; this will create a new file and will prompt you to save it.</li>
        <li>Save the new file to your Inscryption directory.</li>
      </ol>
    </blockquote>

    <input type=file @click="$event.target.value = null" @input=parseFile($event.target.files[0]) />

    <template v-if=loading>
      <p>
        <b>Loading...</b>
      </p>
    </template>

    <template v-else-if=saveFile>
      <form name=main @submit.prevent=createFile>
        <br>

        <template v-if=saveFile.ascensionData>
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

            <tab title="Kaycee's Mod">
              <template v-if=saveFile.ascensionData?.currentRun>
                <forms-kmod />
              </template>

              <template v-else>
                <forms-kmod-no-run />
              </template>
            </tab>
          </tabs>
        </template>

        <template v-else>
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
          </tabs>
        </template>

        <p>
          <label title="If the file is currently in console format, it will be translated to PC format; if it is currently in PC format it will be translated to console format. When in doubt, leave this unchecked.">
            <template v-if=consoleFormat>
              Change file to PC format
            </template>
            <template v-else>
              Change file to console format
            </template>
            <input type=checkbox v-model=switchFormat />
          </label>

          <br>
          <br>

          <input type=submit value=Save />
        </p>
      </form>
    </template>

    <a ref=ghostLink hidden />
  </div>
</template>

<script setup lang=ts>
  const email = 'jlcrochet91@pm.me'
  const repo = 'https://github.com/jlcrochet/inscryption_save_editor'
  
  const loading = ref(false)

  const ghostLink = shallowRef<HTMLAnchorElement>(null)

  const saveFile = ref(null)
  provide('saveFile', saveFile)

  const consoleFormat = ref(false)
  const switchFormat = ref(false)

  const utf8 = {
    encoder: new TextEncoder(),
    decoder: new TextDecoder(),
    encode(text: string): Uint8Array
    {
      return this.encoder.encode(text)
    },
    decode(bytes: Uint8Array): string
    {
      return this.decoder.decode(bytes)
    }
  }

  let fileName: string
  let header: Uint8Array | null
  let fs: any
  let fsSaveFileIndex: number

  async function parseFile(file: File)
  {
    try {
      loading.value = true

      fileName = file.name
      let fileBytes = new Uint8Array(await file.arrayBuffer())

      fs = null

      let body: Uint8Array

      if (fileBytes.at(0) == 0x00 && fileBytes.at(-1) == 0x0B /* vertical tab */) {
        consoleFormat.value = true
        let [h, b] = parseBody(fileBytes)
        header = h
        body = b
      }
      else if (fileBytes.at(0) == 0x7B /* `{` */) {
        let i = 1

        while (fileBytes.at(i) <= 0x20 /* ` ` */)
          i += 1

        if (utf8.decode(fileBytes.slice(i, i + 8)) == '"_files"') {
          consoleFormat.value = true
          let json = utf8.decode(fileBytes)
          fs = JSON.parse(json)
          fsSaveFileIndex = fs._files.findIndex(f => f._fullPath == '/SaveFile.gwsave')
          let [h, b] = parseBody(Uint8Array.from(fs._files[fsSaveFileIndex]._data))
          header = h
          body = b
        }
        else {
          consoleFormat.value = false
          header = null
          body = fileBytes
        }
      }
      else {
        throw 'Unrecognized file format'
      }

      body = normalizeJSON(body)

      let text = utf8.decode(body)

      let ids: object[] = []
      let types: string[] = []

      let data = JSON.parse(text, function(key: string, value: any): any {
        switch (key) {
          case "$id":
            ids[value] = this
            break
          case "$type":
            if (typeof value == "number") {
              return types[value]
            }
            else {
              let [n, type] = value.split("|", 2)
              types[n] = type
              return type
            }
          default:
            if (typeof value == "string" && value.startsWith("$iref")) {
              let [_, n] = value.split(":", 2)
              return ids[parseInt(n)]
            }
        }

        return value
      })

      let decks = [
        data.currentRun.playerDeck,
        data.gbcData.deck,
        data.part3Data.deck,
        data.grimoraData.deck
      ]

      if (data.ascensionData?.currentRun)
        decks.push(data.ascensionData.currentRun.playerDeck)

      for (let deck of decks) {
        // Normalize the card mod info list:
        //
        // 1. Ensure that all mod info keys are in the format `[name]#[index]`.
        //
        // 2. Ensure that the mod info list is cowitnessed with the card list
        // for easier lookups.
        for (let modInfo of deck.cardIdModInfos.$rcontent) {
          if (!/#\d+$/.test(modInfo.$k))
            modInfo.$k += "#0"
        }

        let tally = {}

        deck.cardIdModInfos.$rcontent = deck.cardIds.$rcontent.map(name => {
          tally[name] ??= 0
          let search = name + "#" + tally[name]++
          return deck.cardIdModInfos.$rcontent.find(modInfo => modInfo.$k == search)
        })
      }

      // Stub boon arrays if they don't already exist:
      data.currentRun.playerDeck.boonIds ??= {
        $type: "System.Collections.Generic.List`1[[DiskCardGame.BoonData+Type, Assembly-CSharp]], mscorlib",
        $rlength: 0,
        $rcontent: []
      }

      if (data.ascensionData?.currentRun) {
        data.ascensionData.currentRun.playerDeck.boonIds ??= {
          $type: "System.Collections.Generic.List`1[[DiskCardGame.BoonData+Type, Assembly-CSharp]], mscorlib",
          $rlength: 0,
          $rcontent: []
        }
      }

      saveFile.value = data
    }
    catch (error) {
      console.error(error)
      alert(`An error occurred while parsing the file. Please e-mail me at ${email} or post an issue on GitHub (${repo}) and I will try to troubleshoot the issue. Please remember to provide the save file that is having issues.`)
    }

    loading.value = false
  }

  function createFile()
  {
    try {
      let body = JSON.stringify(saveFile.value)
      let outputAsConsoleFormat = consoleFormat.value
      let blobParts: any[]

      if (switchFormat.value)
        outputAsConsoleFormat = !outputAsConsoleFormat

      if (outputAsConsoleFormat) {
        // This seems to be a commonly used header, but I currently don't know
        // if it works for all platforms:
        header ??= Uint8Array.of(0,1,0,0,0,255,255,255,255,1,0,0,0,0,0,0,0,6,1,0,0,0)

        if (fs) {
          let payload = [
            ...header,
            ...vlq(body.length),
            ...utf8.encode(body),
            0x0B  // vertical tab; used to indicate EOF
          ]
          fs._files[fsSaveFileIndex]._data = payload
          blobParts = [JSON.stringify(fs)]
        }
        else {
          blobParts = [header, vlq(body.length), body, Uint8Array.of(0x0B)]
        }
      }
      else {
        blobParts = [body]
      }

      let blob = new Blob(blobParts, { type: "application/octet-stream" })

      ghostLink.value.href = URL.createObjectURL(blob)
      ghostLink.value.download = fileName
      ghostLink.value.click()
    }
    catch (error) {
      console.error(error)
      alert(`An error occurred while creating the file. Please e-mail me at ${email} or post an issue on GitHub (${repo}) and I will try to troubleshoot the issue.`)
    }
  }

  function parseBody(bytes: Uint8Array): [Uint8Array, Uint8Array]
  {
    let header = bytes.slice(0, 22)

    // Skip VLQ
    let start = 22
    while (bytes[start] > 0x7F)
      start += 1
    start += 1

    let body = bytes.slice(start, -1)

    return [header, body]
  }

  function vlq(n: number): Uint8Array
  {
    const size = Math.ceil(Math.log2(n + 1) / 7)
    const output = new Uint8Array(size)

    let i = 0

    while (n > 0) {
      let septet = n & 0x7F
      n >>= 7
      if (n > 0)
        septet |= 1 << 7
      output[i++] = septet
    }

    return output
  }

  // Strips redundant whitespace, wraps `$iref` in quotes, and replaces
  // Unity-style vectors with JSON-compatible ones
  function normalizeJSON(bytes: Uint8Array): Uint8Array
  {
    let output: number[] = []
    let regions: string[] = []
    let coordinateX = true
    let isKey = true

    for (let i = 0; i < bytes.length; i += 1) {
      let b = bytes[i]
      let last_region = regions.at(-1)

      if (b <= 0x20 /* whitespace */) {
        if (last_region == 'string')
          output.push(b)
      }
      else if (b == 0x22 /* `"` */) {
        if (last_region == 'string')
          regions.pop()
        else
          regions.push('string')

        output.push(b)
      }
      else if (b == 0x2D || (b >= 0x30 && b <= 0x39) /* `-` or digits */) {
        if (last_region == 'object' && isKey) {
          output.push(0x22, (coordinateX ? 0x78 : 0x79), 0x22, 0x3A)  // `"x|y":`
          coordinateX = !coordinateX

          while (b == 0x2D || b == 0x2E || (b >= 0x30 && b <= 0x39) || b == 0x45 /* `-` or `.` or digits or `E` for exponents */) {
            output.push(b)
            i += 1
            b = bytes[i]
          }

          i -= 1
        }
        else {
          output.push(b)
        }
      }
      else if (b == 0x3A /* `:` */) {
        if (last_region == 'object')
          isKey = false
        output.push(b)
      }
      else if (b == 0x5B /* `[` */) {
        if (last_region != 'string')
          regions.push('array')
        output.push(b)
      }
      else if (b == 0x7B /* `{` */) {
        if (last_region != 'string')
          regions.push('object')
        output.push(b)
      }
      else if (b == 0x5D /* `]` */) {
        if (last_region == 'array')
          regions.pop()
        output.push(b)
      }
      else if (b == 0x7D /* `}` */) {
        if (last_region == 'object') {
          regions.pop()
          isKey = true
        }
        output.push(b)
      }
      else if (b == 0x2C /* `,` */) {
        if (last_region == 'object')
          isKey = true
        output.push(b)
      }
      else if (b == 0x24 /* `$` */) {
        if (last_region == 'string') {
          output.push(b)
        }
        else {
          output.push(0x22)
          while (b > 0x20 && b != 0x2C && b != 0x5D && b != 0x7D /* [^[:space:],\]}] */) {
            output.push(b)
            i += 1
            b = bytes[i]
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
</script>
