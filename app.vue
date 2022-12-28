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

    <p>To report problems, e-mail me at <a href=mailto:jlcrochet91@pm.me>jlcrochet91@pm.me</a> or post an issue on <a href=https://github.com/jlcrochet/inscryption_save_editor>GitHub</a>.</p>

    <p>Instructions:</p>

    <ol>
      <li>
        Click the button below to upload your save file from your Inscryption directory. On PC, the save file will be named <code>SaveFile.gwsave</code>.

        <ul>
          <li>This editor can also edit save files produced by <a href=https://github.com/FlagBrew/Checkpoint>Checkpoint</a>; simply upload your <code>save.fs</code> file instead and the editor should be able to produce another <code>save.fs</code> that you can restore using Checkpoint.</li>
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
            <button>Save</button>
          </p>
        </form>
      </p>
    </template>

    <a ref=ghostLink :download=filename hidden />
  </div>
</template>

<script setup>
  import data from './gameData.json'
  console.log(data)
  const gameData = useState('gameData', () => data)

  const loading = ref(false)
  const filename = ref(null)

  const ghostLink = shallowRef(null)

  const saveFile = useState('saveFile')

  let fileFormat, fileData, saveIndex, header
  const decoder = new TextDecoder('utf-8')

  async function parseFile(file) {
    loading.value = true

    filename.value = file.name
    fileFormat = file.name.substring(file.name.lastIndexOf('.') + 1)

    let text = await file.text()

    let data

    try {
      if (fileFormat == 'fs') {
        // Packed Nintendo Switch file format; we need to extract the actual
        // save data first
        fileData = JSON.parse(text)
        saveIndex = fileData._files.findIndex(f => f._fullPath == '/SaveFile.gwsave')

        let bytes = fileData._files[saveIndex]._data

        // There are some leading and trailing bytes outside of the save data;
        // I have no idea what they're for, but I'm going to assume that
        // they're important; let's save them for later:
        header = bytes.splice(0, 22)

        let remove = 1

        for (let i = 0; i < bytes.length; ++i) {
          if (!(bytes[i] & 1 << 7)) {
            break
          }

          remove += 1
        }

        bytes.splice(0, remove)
        bytes.pop()

        text = decoder.decode(Uint8Array.from(bytes))
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
    } catch {
      alert("There was an error parsing the file. Please send the file to me at jlcrochet91@pm.me and I will try to debug the issue.")
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

  const encoder = new TextEncoder('utf-8')

  function createFile() {
    let text = JSON.stringify(saveFile.value)

    let blob

    switch (fileFormat) {
      case 'gwsave': {
        blob = new Blob([text])
      } break

      case 'fs': {
        let content = Array.from(encoder.encode(text))
        let length = content.length

        do {
          let septet = length & 0b1111111
          length >>= 7

          if (length) {
            septet |= 1 << 7
          }

          header.push(septet)
        } while (length > 0)

        content.push(11)  // I'm assuming that this is some kind of EOF marker

        fileData._files[saveIndex]._data = header.concat(content)
        blob = new Blob([JSON.stringify(fileData)])
      } break
    }

    ghostLink.value.href = URL.createObjectURL(blob)
    ghostLink.value.click()
  }
</script>
