<template>
  <div style="margin: 1em">
    <h1>Inscryption Save Editor</h1>

    <noscript>WARNING: This page doesn't work without JavaScript. Please enable JavaScript in your browser and refresh the page.</noscript>

    <dialog ref=dialog>
      <p>Hello</p>
      <form method=dialog>
        <button>OK</button>
      </form>
    </dialog>

    <button type=button @click=dialog.showModal>TEST</button>

    <blockquote>
      <p>NOTE: Spoilers ahead if you haven't beaten the game yet.</p>

      <p>Read the following before use:</p>

      <ul>
        <li>Make sure that you keep a backup of your original save file before experimenting.</li>
        <li>Avoid making manual changes to your save file before uploading; doing so may cause errors.</li>
        <li>Some cards and sigils may cause errors if played outside of specific contexts; others may do nothing at all.</li>
      </ul>

      <p>To report problems, e-mail me at <a href=mailto:jlcrochet91@pm.me>jlcrochet91@pm.me</a> or post an issue on <a href=https://github.com/jlcrochet/inscryption_save_editor target=_blank>GitHub</a>.</p>

      <p>Instructions:</p>

      <ol>
        <li>
          Click the button below to upload your save file from your Inscryption directory. The save file should be named <code>SaveFile.gwsave</code>.
          <ul>
            <li>This editor can also edit save files produced by <a href=https://github.com/FlagBrew/Checkpoint target=_blank>Checkpoint</a>; simply upload your <code>save.fs</code> file instead and the editor should be able to produce another <code>save.fs</code> that you can restore using Checkpoint.</li>
            <li>If you want this editor to support save files in other formats, please send me an example save file and I'll see what I can do.</li>
          </ul>
        </li>
        <li>A form will appear on the page; use it to make changes to your save file.</li>
        <li>After making changes, click the Save button at the bottom of the page; this will create a new file and will prompt you to save it.</li>
        <li>Save the new file to your Inscryption directory.</li>
      </ol>
    </blockquote>

    <input type=file accept=.gwsave,.fs @click="$event.target.value = null" @input=parseFile($event.target.files[0]) />

    <template v-if=loading>
      <p>
        <b>Loading...</b>
      </p>
    </template>

    <template v-else-if=saveFile>
      <p>
        <form name=main @submit.prevent=createFile>
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
            <button>Save</button>&nbsp;&nbsp;&nbsp;&nbsp;Output format:&nbsp;<select v-model=outputFormat>
              <option value=gwsavePC>.gwsave (PC)</option>
              <option value=gwsaveSwitch>.gwsave (Nintendo Switch)</option>
              <option value=fs>.fs (Checkpoint)</option>
            </select>
          </p>
        </form>
      </p>
    </template>

    <a ref=ghostLink hidden />
  </div>
</template>

<script setup>
  const loading = ref(false)
  const outputFormat = ref("gwsavePC")

  const defaultFileNames = {
    gwsavePC: "SaveFile.gwsave",
    gwsaveSwitch: "SaveFile.gwsave",
    fs: "save.fs"
  }

  const ghostLink = shallowRef(null)

  const dialog = shallowRef(null)

  const saveFile = useState('saveFile')

  const codec = {
    encoder: new TextEncoder(),
    decoder: new TextDecoder(),
    encode(text) { return this.encoder.encode(text) },
    decode(bytes) { return this.decoder.decode(bytes) }
  }

  // Standard header for Nintendo Switch save files; not sure what these bytes
  // indicate, but they seem to be consistent.
  const switchHeader = Uint8Array.of(0, 1, 0, 0, 0, 255, 255, 255, 255, 1, 0, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 0)

  let fileExtension, fsData, fsIndex

  async function parseFile(file) {
    try {
      loading.value = true
      fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1)

      let bytes

      if (fileExtension == "fs") {
        outputFormat.value = "fs"

        let json = await file.text()

        fsData = JSON.parse(json)
        fsIndex = fsData._files.findIndex(f => f._fullPath == '/SaveFile.gwsave')

        let data = fsData._files[fsIndex]._data

        bytes = parseBody(Uint8Array.from(data))
      } else {
        let buffer = await file.arrayBuffer()

        bytes = new Uint8Array(buffer)

        if (bytes[0] == 0x7B /* { */) {
          outputFormat.value = "gwsavePC"
        } else {
          outputFormat.value = "gwsaveSwitch"
          bytes = parseBody(bytes)
        }
      }

      bytes = normalizeJSON(bytes)

      let text = codec.decode(bytes)

      let ids = []
      let types = []

      let data = JSON.parse(text, function(key, value) {
        switch (key) {
          case "$id": {
            ids[value] = this
          } break

          case "$type": {
            if (typeof value == "number") {
              return types[value]
            } else {
              let [n, type] = value.split("|", 2)
              types[n] = type
              return type
            }
          } break

          default: {
            if (typeof value == "string" && value.startsWith("$iref")) {
              let [_, n] = value.split(":", 2)
              return ids[n]
            }
          } break
        }

        return value
      })

      let decks = [
        data.currentRun.playerDeck,
        data.gbcData.deck,
        data.part3Data.deck,
        data.grimoraData.deck
      ]

      if (data.ascensionData?.currentRun) {
        decks.push(data.ascensionData.currentRun.playerDeck)
      }

      for (let deck of decks) {
        // Normalize the card mod info list:
        //
        // 1. Ensure that all mod info keys are in the format `[name]#[index]`.
        //
        // 2. Ensure that the mod info list is cowitnessed with the card list
        // for easier lookups.
        for (let modInfo of deck.cardIdModInfos.$rcontent) {
          if (!/#\d+$/.test(modInfo.$k)) {
            modInfo.$k += "#0"
          }
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
    } catch (error) {
      console.error(error)
      alert("An error occurred while parsing the file. Please e-mail at jlcrochet91@pm.me me or post an issue on GitHub (https://github.com/jlcrochet/inscryption_save_editor) and I will try to troubleshoot the issue.")
    }

    loading.value = false
  }

  function createFile() {
    try {
      let payload = generatePayload()
      let blob = new Blob([payload], { type: "application/octet-stream" })

      ghostLink.value.href = URL.createObjectURL(blob)
      ghostLink.value.download = defaultFileNames[outputFormat.value]
      ghostLink.value.click()
    } catch (error) {
      console.error(error)
      alert('An error occurred while creating the file. Please e-mail me at jlcrochet91@pm.me or post an issue on GitHub (https://github.com/jlcrochet/inscryption_save_editor) and I will try to troubleshoot the issue.')
    }
  }

  // Strips redundant whitespace, wraps `$iref` in quotes, and replaces
  // Unity-style vectors with JSON-compatible ones
  function normalizeJSON(bytes) {
    let output = []

    let stack = []
    let last = () => stack[stack.length - 1]
    let coordinateX = true
    let isKey = true

    for (let i = 0; i < bytes.length; i += 1) {
      let b = bytes[i]

      if (b <= 0x20 /* whitespace */) {
        if (last() == 'string') {
          output.push(b)
        }
      } else if (b == 0x22 /* " */) {
        if (last() == 'string') {
          stack.pop()
        } else {
          stack.push('string')
        }

        output.push(b)
      } else if (b == 0x2D || (b >= 0x30 && b <= 0x39) /* - or digits */) {
        if (last() == 'object' && isKey) {
          output.push(0x22, coordinateX ? 0x78 : 0x79, 0x22, 0x3A)  // "x|y":
          coordinateX = !coordinateX

          while (b == 0x2D || b == 0x2E || (b >= 0x30 && b <= 0x39) /* - or . or digits */) {
            output.push(b)
            i += 1
            b = bytes[i]
          }

          i -= 1
        } else {
          output.push(b)
        }
      } else if (b == 0x3A /* : */) {
        if (last() == 'object') {
          isKey = false
        }

        output.push(b)
      } else if (b == 0x5B /* [ */) {
        if (last() != 'string') {
          stack.push('array')
        }

        output.push(b)
      } else if (b == 0x7B /* { */) {
        if (last() != 'string') {
          stack.push('object')
        }

        output.push(b)
      } else if (b == 0x5D /* ] */) {
        if (last() == 'array') {
          stack.pop()
        }

        output.push(b)
      } else if (b == 0x7D /* } */) {
        if (last() == 'object') {
          stack.pop()
          isKey = true
        }

        output.push(b)
      } else if (b == 0x2C /* , */) {
        if (last() == 'object') {
          isKey = true
        }

        output.push(b)
      } else if (b == 0x24 /* $ */) {
        if (last() == 'string') {
          output.push(b)
        } else {
          output.push(0x22)

          while (b > 0x20 && b != 0x2C && b != 0x5D && b != 0x7D /* [^[:space:],\]}] */) {
            output.push(b)
            i += 1
            b = bytes[i]
          }

          i -= 1

          output.push(0x22)
        }
      } else {
        output.push(b)
      }
    }

    return Uint8Array.from(output)
  }

  function generatePayload() {
    let json = JSON.stringify(saveFile.value)

    switch (outputFormat.value) {
      case "gwsavePC": {
        return json
      }

      case "gwsaveSwitch": {
        return generateBytes(json)
      }

      case "fs": {
        let payload = generateBytes(json)

        if (fileExtension == "fs") {
          fsData._files[fsIndex]._data = Array.from(payload)
          return JSON.stringify(fsData)
        } else {
          let fs = {
            _files: [
              {
                _fullPath: "/SaveFile.gwsave",
                _data: Array.from(payload)
              }
            ],
            _directories: []
          }

          return JSON.stringify(fs)
        }
      }

      default: {
        throw "Invalid output format"
      }
    }
  }

  function generateBytes(json) {
    let bytes = codec.encode(json)

    // length of header bytes +
    // length of input +
    // number of bytes needed for storing VLQ +
    // EOF
    let size =
      switchHeader.length +
      bytes.length +
      Math.ceil(Math.log2(bytes.length + 1) / 7) +
      1

    let output = new Uint8Array(size)
    let offset = 0

    // 1. Header
    output.set(switchHeader, offset)
    offset += switchHeader.length

    // 2. VLQ
    let n = bytes.length

    while (n > 0) {
      let septet = n & 0b0111_1111

      n >>= 7

      if (n > 0) {
        septet |= 1 << 7
      }

      output[offset++] = septet
    }

    // 3. Body
    output.set(bytes, offset)
    offset += bytes.length

    // 4. EOF; ASCII Vertical Tab (0x0B) is used to indicate EOF
    output[offset] = 0x0B

    return output
  }

  function parseBody(bytes) {
    // Skip VLQ
    let start

    for (start = switchHeader.length; start < bytes.length; ++start) {
      if (!(bytes[start] & 1 << 7)) {
        start += 1
        break
      }
    }

    let payload = new Uint8Array(
      bytes.buffer,
      start,
      bytes.lastIndexOf(0x7D /* } */) + 1 - start
    )

    return payload
  }
</script>
