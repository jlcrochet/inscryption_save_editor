<template>
  <div style="margin: 1em">
    <h1>Inscryption Save Editor</h1>

    <noscript>WARNING: This page doesn't work without JavaScript. Please enable JavaScript and refresh the page.</noscript>

    <p>NOTE: Spoilers ahead if you haven't beaten the game yet.</p>

    <p>Read the following before use:</p>

    <ul>
      <li>Avoid making manual changes to your save file before uploading; doing so may cause errors.</li>
      <li>Some cards and sigils may cause errors if played outside of specific contexts; others may do nothing at all. Make sure that you make a backup of your save file before experimenting.</li>
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

    <input type=file accept=.gwsave,.fs @click="$event.target.value = null" @input=parseFile($event.target.files[0]) />

    <template v-if=loading>
      <p>
        <b>Loading...</b>
      </p>
    </template>

    <template v-else-if=saveFile>
      <p>
        <form name=main @submit.prevent=createFile>
          <tabs>
            <tab title="Global">
              <forms-global />
            </tab>

            <tab title="Part One">
              <forms-part-one />
            </tab>

            <tab title="Part Two">
              <forms-part-two />
            </tab>

            <tab title="Part Three">
              <forms-part-three />
            </tab>

            <tab title="Part Four">
              <forms-part-four />
            </tab>

            <tab title="Kaycee's Mod">
              <template v-if=saveFile.ascensionData.currentRun>
                <forms-kmod />
              </template>

              <template v-else>
                <forms-kmod-no-run />
              </template>
            </tab>
          </tabs>

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

    <a ref=ghostLink :download=filename hidden />
  </div>
</template>

<script setup>
  import data from './game-data.json'
  const gameData = useState('gameData', () => data)

  const loading = ref(false)
  const outputFormat = ref("gwsavePC")

  const filename = computed(() => {
    switch (outputFormat.value) {
      case "gwsavePC": return "SaveFile.gwsave"
      case "gwsaveSwitch": return "SaveFile.gwsave"
      case "fs": return "save.fs"
      default: throw "Invalid output format"
    }
  })

  const ghostLink = shallowRef(null)

  const saveFile = useState('saveFile')

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  // Standard header for Nintendo Switch save files; not sure what these bytes
  // indicate, but they seem to be consistent.
  const switchHeader = [0, 1, 0, 0, 0, 255, 255, 255, 255, 1, 0, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 0]

  let fileExtension, fsData, fsIndex

  async function parseFile(file) {
    loading.value = true

    let data

    try {
      let text

      fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1)

      if (fileExtension == "fs") {
        outputFormat.value = "fs"

        let json = await file.text()

        fsData = JSON.parse(json)
        fsIndex = fsData._files.findIndex(f => f._fullPath == '/SaveFile.gwsave')

        let data = fsData._files[fsIndex]._data
        let bytes = new Uint8Array(data)

        text = parseBody(bytes)
      } else {
        let buffer = await file.arrayBuffer()
        let bytes = new Uint8Array(buffer)

        if (bytes[0] == 0x7B /*{*/) {
          outputFormat.value = "gwsavePC"
          text = decoder.decode(bytes)
        } else {
          outputFormat.value = "gwsaveSwitch"
          text = parseBody(bytes)
        }
      }

      // There are a few things we have to do to the input file before we can
      // use it:
      //
      // First, we must replace non-standard JSON values with temporary
      // placeholders; this involves wrapping `$iref` values in quotes and
      // placing actual `x` and `y` keys inside vectors.

      text = text
        .replace(/\$iref:\d+/g, '"$&"')
        .replace(/"(position|\w*?Position)":\s*{\s*"\$type":\s*(".*?"|-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\s*}/g, '"$1":{"$type":$2,"x":$3,"y":$4}')

      let ids = []
      let types = []

      data = JSON.parse(text, function(key, value) {
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
    } catch (error) {
      console.error(error)
      alert("There was an error parsing the file. Please e-mail me or post an issue on GitHub and I will try to troubleshoot the issue.")
      return
    }

    let decks = [
      data.currentRun.playerDeck,
      data.gbcData.deck,
      data.part3Data.deck,
      data.grimoraData.deck
    ]

    if (data.ascensionData.currentRun) {
      decks.push(data.ascensionData.currentRun.playerDeck)
    }

    for (let deck of decks) {
      // Normalize the card mod info list:
      //
      // 1. Ensure that all mod info keys are in the format
      // `[name]#[index]`.
      //
      // 2. Ensure that the mod info list is cowitnessed
      // with the card list for easier lookups.
      for (let modInfo of deck.cardIdModInfos.$rcontent) {
        if (/^[\w!]+$/.test(modInfo.$k)) {
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

    if (data.ascensionData.currentRun) {
      data.ascensionData.currentRun.playerDeck.boonIds ??= {
        $type: "System.Collections.Generic.List`1[[DiskCardGame.BoonData+Type, Assembly-CSharp]], mscorlib",
        $rlength: 0,
        $rcontent: []
      }
    }

    saveFile.value = data
    loading.value = false
  }

  function createFile() {
    let payload = generatePayload()
    let blob = new Blob(payload)

    ghostLink.value.href = URL.createObjectURL(blob)
    ghostLink.value.click()
  }

  function generatePayload() {
    let json = JSON.stringify(saveFile.value)

    switch (outputFormat.value) {
      case "gwsavePC": {
        return [json]
      }

      case "gwsaveSwitch": {
        let bytes = encoder.encode(json)

        return [
          String.fromCharCode(...switchHeader),
          String.fromCharCode(...vlq(bytes.length)),
          json,
          "\x0B"
        ]
      }

      case "fs": {
        let bytes = encoder.encode(json)

        let payload = [
          ...switchHeader,
          ...vlq(bytes.length),
          ...bytes,
          0x0B
        ]

        if (fileExtension == "fs") {
          fsData._files[fsIndex]._data = payload
          return [JSON.stringify(fsData)]
        } else {
          let fs = {
            _files: [
              {
                _fullPath: "/SaveFile.gwsave",
                _data: payload
              }
            ],
            _directories: []
          }

          return [JSON.stringify(fs)]
        }
      }

      default: {
        throw "Invalid output format"
      }
    }
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
      bytes.lastIndexOf(0x7D /*}*/) + 1 - start
    )

    return decoder.decode(payload)
  }

  function vlq(n) {
    if (n == 0) {
      return new Uint8Array([0])
    }

    let bytes = new Uint8Array(Math.ceil(Math.log2(n + 1) / 7))
    let size = 0

    do {
      let septet = n & 0b1111111
      n >>= 7

      if (n > 0) {
        septet |= 1 << 7
      }

      bytes[size++] = septet
    } while (n > 0)

    return bytes
  }
</script>
