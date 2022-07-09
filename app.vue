<template>
  <div id=content>
    <h1>Inscryption Save Editor</h1>

    <noscript>WARNING: This page doesn't work without JavaScript. Please enable JavaScript and refresh the page.</noscript>

    <p>NOTE: Spoilers ahead if you haven't beaten the game yet.</p>

    <p>Read the following before use:</p>

    <ul>
      <li>This is designed to be used with Kaycee's Mod; it is not guaranteed to work with the base game, although it might.</li>
      <li>Avoid making manual changes to your save file before uploading; doing so may cause errors.</li>
      <li>Some cards and sigils may cause errors if played outside of specific contexts; others may do nothing at all. Make sure that you make a backup of your save file before experimenting.</li>
    </ul>

    <p>To report problems, e-mail me at <a href=mailto:jlcrochet@hey.com>jlcrochet@hey.com</a> or post an issue on <a href=https://github.com/jlcrochet/inscryption_save_editor>GitHub</a>.</p>

    <p>Instructions:</p>

    <ol>
      <li>Click the button below to upload your save file. The save file is called <code>SaveFile.gwsave</code> and is located in the root of your Inscryption directory.</li>
      <li>A form will appear on the page; use it to make changes to your save file.</li>
      <li>After making changes, click the Save button at the bottom of the page; this will create a new file and will prompt you to save it.</li>
      <li>Save the new file as <code>SaveFile.gwsave</code> in your Inscryption directory.</li>
    </ol>

    <input type=file accept=.gwsave @click="$event.target.value = null" @input=parseFile($event.target.files[0]) />

    <template v-if=saveFile>
      <p>
        <form name=main @submit.prevent=createFile>
          <fieldset>
            <legend>
              <table>
                <tr>
                  <td>
                    <button type=button :disabled="tabIndex === 0" @click=setTab(0)>
                      Global
                    </button>
                  </td>

                  <td>
                    <button type=button :disabled="tabIndex === 1" @click=setTab(1)>
                      Part One
                    </button>
                  </td>

                  <td>
                    <button type=button :disabled="tabIndex === 2" @click=setTab(2)>
                      Part Two
                    </button>
                  </td>

                  <td>
                    <button type=button :disabled="tabIndex === 3" @click=setTab(3)>
                      Part Three
                    </button>
                  </td>

                  <td>
                    <button type=button :disabled="tabIndex === 4" @click=setTab(4)>
                      Part Four
                    </button>
                  </td>

                  <td>
                    <button type=button :disabled="tabIndex === 5" @click=setTab(5)>
                      Kaycee's Mod
                    </button>
                  </td>
                </tr>
              </table>
            </legend>

            <forms-global v-show="tabIndex === 0" :save-file=saveFile :game-data=gameData />
            <forms-part-one v-show="tabIndex === 1" :save-file=saveFile :game-data=gameData />
            <forms-part-two v-show="tabIndex === 2" :save-file=saveFile :game-data=gameData />
            <forms-part-three v-show="tabIndex === 3" :save-file=saveFile :game-data=gameData />
            <forms-part-four v-show="tabIndex === 4" :save-file=saveFile :game-data=gameData />

            <template v-if=saveFile.ascensionData?.currentRun>
              <forms-kmod v-show="tabIndex === 5" :save-file=saveFile :game-data=gameData />
            </template>

            <template v-else>
              <forms-kmod-no-run v-show="tabIndex === 5" :save-file=saveFile :game-data=gameData />
            </template>
          </fieldset>

          <p>
            <button>Save</button>
          </p>
        </form>
      </p>
    </template>

    <a ref=ghostLink download=SaveFile.gwsave hidden />
  </div>
</template>

<script>
  export default {
      data() {
          return {
              saveFile: null,
              tabIndex: 0,

              gameData: {
                  cardNames: [
                      ["!BOUNTYHUNTER_BASE", "!BOUNTYHUNTER_BASE"],
                      ["!BUILDACARD_BASE", "!BUILDACARD_BASE"],
                      ["!CORRUPTED", "!CORRUPTED"],
                      ["!DEATHCARD_BASE", "!DEATHCARD_BASE"],
                      ["!DEATHCARD_LESHY", "!DEATHCARD_LESHY"],
                      ["!DEATHCARD_PIXEL_BASE", "!DEATHCARD_PIXEL_BASE"],
                      ["!DEATHCARD_VICTORY", "!DEATHCARD_VICTORY"],
                      ["!FRIENDCARD_BASE", "!FRIENDCARD_BASE"],
                      ["!INSPECTOR", "!INSPECTOR"],
                      ["!MELTER", "!MELTER"],
                      ["!MYCOCARD_BASE", "!MYOCARD_BASE"],
                      ["!MYCO_OLD_DATA", "!MYCO_OLD_DATA"],
                      ["!STATIC!GLITCH", "!STATIC!GLITCH"],
                      ["3LK", "CXformerElk"],
                      ["49er", "MineCart"],
                      ["ADD3R", "CXformerAdder"],
                      ["Adder", "Adder"],
                      ["Alarm Bot", "AlarmBot"],
                      ["Alpha", "Alpha"],
                      ["Amalgam", "Amalgam"],
                      ["Amoeba", "Amoeba"],
                      ["Amoebot", "Amoebot"],
                      ["Ancient Fir", "Tree_Hologram"],
                      ["Annoy FM", "AnnoyTower"],
                      ["Ant Queen", "AntQueen"],
                      ["AquaSquirrel", "AquaSquirrel"],
                      ["Automaton", "Automaton"],
                      ["Bad Fish", "Angler_Fish_Bad"],
                      ["Bait Bucket", "BaitBucket"],
                      ["Banshee", "Banshee"],
                      ["Bat", "Bat"],
                      ["Beaver", "Beaver"],
                      ["Bee", "Bee"],
                      ["Beehive", "Beehive"],
                      ["Bell Tentacle", "SquidBell"],
                      ["Black Goat", "Goat"],
                      ["Bleene's Mox", "MoxDualBG"],
                      ["Bleene's Vessel", "SentinelOrange"],
                      ["Bloodhound", "Bloodhound"],
                      ["Blue Mage", "BlueMage"],
                      ["Blue Sporemage", "BlueMage_Fused"],
                      ["Bolthound", "BoltHound"],
                      ["Bomb Latcher", "LatcherBomb"],
                      ["Bone Heap", "Bonepile"],
                      ["Bone Lord's Horn", "BonelordHorn"],
                      ["Bonehound", "Bonehound"],
                      ["Boulder", "Boulder"],
                      ["Bridge Rails", "BridgeRailing"],
                      ["Broken Bot", "BrokenBot"],
                      ["Broken Obol (left)", "CoinLeft"],
                      ["Broken Obol (right)", "CoinRight"],
                      ["Buff Conduit", "AttackConduit"],
                      ["Bullfrog", "Bullfrog"],
                      ["Burrowing Trap", "BurrowingTrap"],
                      ["Busted 3D Printer", "BustedPrinter"],
                      ["Caged Wolf", "CagedWolf"],
                      ["Captive File", "CaptiveFile"],
                      ["Cat", "Cat"],
                      ["Child 13", "JerseyDevil"],
                      ["Chime", "DausBell"],
                      ["Cockroach", "Cockroach"],
                      ["Conduit Tower", "ConduitTower"],
                      ["Corpse Maggots", "Maggots"],
                      ["Coyote", "Coyote"],
                      ["Cuckoo", "Cuckoo"],
                      ["Curious Egg", "HydraEgg"],
                      ["Curve Hopper", "AboveCurve"],
                      ["DUMMY_5-5", "DUMMY_5-5"],
                      ["Dam", "Dam"],
                      ["Dead Hand", "DeadHand"],
                      ["Dead Tree", "DeadTree"],
                      ["Dire Wolf", "DireWolf"],
                      ["Dire Wolf Cub", "DireWolfCub"],
                      ["Double Gunner", "CloserBot"],
                      ["Draugr", "Draugr"],
                      ["Drowned Soul", "DrownedSoul"],
                      ["Elk", "Elk"],
                      ["Elk Fawn", "ElkCub"],
                      ["Emerald Mox", "MoxEmerald"],
                      ["Emerald Vessel", "EmptyVessel_GreenGem"],
                      ["Empty Vessel", "EmptyVessel"],
                      ["Energy Bot", "BatteryBot"],
                      ["Energy Conduit", "EnergyConduit"],
                      ["ExeSkeleton", "RoboSkeleton"],
                      ["Explode Bot", "Bombbot"],
                      ["Factory Conduit", "FactoryConduit"],
                      ["Field Mice", "FieldMouse"],
                      ["Fishbot", "Angler_Talking"],
                      ["Flying Ant", "AntFlying"],
                      ["Force Mage", "ForceMage"],
                      ["Frank & Stein", "FrankNStein"],
                      ["Frozen Opossum", "FrozenOpossum"],
                      ["Furry Tail", "Tail_Furry"],
                      ["GR1ZZ", "XformerGrizzlyBot"],
                      ["GR1ZZ (transformed)", "XformerGrizzlyBeast"],
                      ["Gamblobot", "EnergyRoller"],
                      ["Geck", "Geck"],
                      ["Gem Detonator", "GemExploder"],
                      ["Gem Fiend", "GemFiend"],
                      ["Gem Guardian", "GemShielder"],
                      ["Gembound Ripper", "GemRipper"],
                      ["Gems Conduit", "GemsConduit"],
                      ["Ghost Ship", "GhostShip"],
                      ["Gift Bot", "GiftBot"],
                      ["Gold Nugget", "GoldNugget"],
                      ["Golden Pelt", "PeltGolden"],
                      ["Good Fish", "Angler_Fish_Good"],
                      ["Goranj's Mox", "MoxDualGO"],
                      ["Goranj's Vessel", "SentinelBlue"],
                      ["Gourmage", "MarrowMage"],
                      ["Grand Fir", "Tree"],
                      ["Gravedigger", "Gravedigger"],
                      ["Great Kraken", "Kraken"],
                      ["Great White", "Shark"],
                      ["Greater Smoke", "Smoke_Improved"],
                      ["Green Mage", "GreenMage"],
                      ["Grizzly", "Grizzly"],
                      ["Hand Tentacle", "SquidCards"],
                      ["Hawk", "Hawk"],
                      ["Headless Horseman", "HeadlessHorseman"],
                      ["Heal Conduit", "HealerConduit"],
                      ["Hodag", "Hodag"],
                      ["Hover Mage", "FlyingMage"],
                      ["Hrokkall", "Hrokkall"],
                      ["Hydra", "Hydra"],
                      ["Ijiraq", "Ijiraq"],
                      ["Insectodrone", "Insectodrone"],
                      ["Junior Sage", "JuniorSage"],
                      ["Kind Cell", "CellGift"],
                      ["Kingfisher", "Kingfisher"],
                      ["L33pB0t", "LeapBot"],
                      ["Lammergeier", "Lammergeier"],
                      ["Leaping Trap", "Trap"],
                      ["Librarian", "Librarian"],
                      ["Lonely Wizbot", "BlueMage_Talking"],
                      ["Long Elk", "Snelk"],
                      ["M3atB0t", "MeatBot"],
                      ["Mage Knight", "MageKnight"],
                      ["Mage Pupil", "Pupil"],
                      ["Magnus Mox", "MoxTriple"],
                      ["Magpie", "Magpie"],
                      ["Mantis", "Mantis"],
                      ["Mantis God", "MantisGod"],
                      ["Master Bleene", "MasterBleene"],
                      ["Master Goranj", "MasterGoranj"],
                      ["Master Orlu", "MasterOrlu"],
                      ["Meal Worm", "MealWorm"],
                      ["Mirror Tentacle", "SquidMirror"],
                      ["Mole", "Mole"],
                      ["Mole (Telegrapher)", "Mole_Telegrapher"],
                      ["Mole Man", "MoleMan"],
                      ["Moose Buck", "Moose"],
                      ["More Fish", "Angler_Fish_More"],
                      ["Mothman", "Mothman_Stage3"],
                      ["Mox Module", "TechMoxTriple"],
                      ["Mrs. Bomb", "BombMaiden"],
                      ["Mud Turtle", "MudTurtle"],
                      ["Mummy Lord", "Mummy"],
                      ["Mummy Lord (Telegrapher)", "Mummy_Telegrapher"],
                      ["Muscle Mage", "MuscleMage"],
                      ["Necromancer", "Necromancer"],
                      ["Null Conduit", "NullConduit"],
                      ["Opossum", "Opossum"],
                      ["Orange Mage", "OrangeMage"],
                      ["Orlu's Mox", "MoxDualOB"],
                      ["Orlu's Vessel", "SentinelGreen"],
                      ["Ouroboros", "Ouroboros"],
                      ["Ourobot", "Ouroboros_Part3"],
                      ["Pack Mule", "Mule"],
                      ["Pack Rat", "PackRat"],
                      ["Pelt Lice", "Lice"],
                      ["Pharaoh's Pets", "DeadPets"],
                      ["Plasma Jimmy", "PlasmaGunner"],
                      ["Porcupine", "Porcupine"],
                      ["Practice Mage", "PracticeMageSmall"],
                      ["Practice Wizard", "PracticeMage"],
                      ["Pronghorn", "Pronghorn"],
                      ["QU177", "XformerPorcupineBot"],
                      ["QU177 (transformed)", "XformerPorcupineBeast"],
                      ["RAV3N", "CXformerRaven"],
                      ["Rabbit", "Rabbit"],
                      ["Rabbit Pelt", "PeltHare"],
                      ["Raccoon", "Raccoon"],
                      ["Rat King", "RatKing"],
                      ["Rattler", "Rattler"],
                      ["Raven", "Raven"],
                      ["Raven Egg", "RavenEgg"],
                      ["Red Hart", "RedHart"],
                      ["Revenant", "Revenant"],
                      ["Ring Worm", "RingWorm"],
                      ["River Otter", "Otter"],
                      ["River Snapper", "Snapper"],
                      ["Ruby Golem", "RubyGolem"],
                      ["Ruby Mox", "MoxRuby"],
                      ["Ruby Vessel", "EmptyVessel_OrangeGem"],
                      ["S0N1A", "XformerBatBot"],
                      ["S0N1A (transformed)", "XformerBatBeast"],
                      ["Salmon", "Salmon"],
                      ["Sapphire Mox", "MoxSapphire"],
                      ["Sapphire Vessel", "EmptyVessel_BlueGem"],
                      ["Sarcophagus", "Sarcophagus"],
                      ["Sentry Drone", "SentryBot"],
                      ["Sentry Spore", "SentryBot_Fused"],
                      ["Shield Latcher", "LatcherShield"],
                      ["Shieldbot", "Shieldbot"],
                      ["Shutterbug", "Shutterbug"],
                      ["Skel-e-latcher", "LatcherBrittle"],
                      ["Skelemagus", "SkeletonMage"],
                      ["Skeleton", "Skeleton"],
                      ["Skink", "Skink"],
                      ["Skunk", "Skunk"],
                      ["Sniper Bot", "Sniper"],
                      ["Snowy Fir", "Tree_SnowCovered"],
                      ["Snowy Fir (hologram)", "Tree_Hologram_SnowCovered"],
                      ["Sparrow", "Sparrow"],
                      ["Splinter Cell", "CellTri"],
                      ["Spore Mice", "FieldMouse_Fused"],
                      ["Sporedigger", "Gravedigger_Fused"],
                      ["Squirrel", "Squirrel"],
                      ["Squirrel Ball", "SquirrelBall"],
                      ["Starvation", "Starvation"],
                      ["Steambot", "Steambot"],
                      ["Steel Mice", "RoboMice"],
                      ["Stim Mage", "StimMage"],
                      ["Stinkbug", "Stinkbug_Talking"],
                      ["Stoat", "Stoat"],
                      ["Stoat (talking)", "Stoat_Talking"],
                      ["Strange Frog", "TrapFrog"],
                      ["Strange Larva", "Mothman_Stage1"],
                      ["Strange Pupa", "Mothman_Stage2"],
                      ["Stump", "Stump"],
                      ["Stunted Wolf", "Wolf_Talking"],
                      ["Swapbot", "SwapBot"],
                      ["Tadpole", "Tadpole"],
                      ["Tail", "DefaultTail"],
                      ["Tail Feathers", "Tail_Bird"],
                      ["The Daus", "Daus"],
                      ["The Moon", "!GIANTCARD_MOON"],
                      ["The Smoke", "Smoke"],
                      ["The Smoke (no bones)", "Smoke_NoBones"],
                      ["The Stones", "CardMergeStones"],
                      ["The Walkers", "Family"],
                      ["Thick Droid", "Thickbot"],
                      ["Tomb Robber", "TombRobber"],
                      ["Tombstone", "TombStone"],
                      ["Tough Cell", "CellBuff"],
                      ["Turkey Vulture", "Vulture"],
                      ["Undead Cat", "CatUndead"],
                      ["Urayuli", "Urayuli"],
                      ["W07F", "CXformerWolf"],
                      ["Warren", "Warren"],
                      ["Wild Bull", "WildBull"],
                      ["Wolf", "Wolf"],
                      ["Wolf Cub", "WolfCub"],
                      ["Wolf Pelt", "PeltWolf"],
                      ["Wolverine", "Wolverine"],
                      ["Worker Ant", "Ant"],
                      ["Wriggling Leg", "Tail_Insect"],
                      ["Wriggling Tail", "SkinkTail"],
                      ["Zombie", "Zombie"]
                  ],

                  abilities: [
                      ["Rabbit Hole", "When a card bearing this sigil is played, a Rabbit is created in your hand. A Rabbit is defined as: 0 Power, 1 Health."],
                      ["Bees Within", "Once a card bearing this sigil is struck, a Bee is created in your hand. A Bee is defined as: 1 Power, 1 Health, Guardian."],
                      ["Sprinter", "At the end of the owner's turn, a card bearing this sigil will move in the direction inscribed in the sigil."],
                      ["Touch of Death", "When a card bearing this sigil damages another creature, that creature perishes."],
                      ["Fledgling", "A card bearing this sigil will grow into a more powerful form after 1 turn on the board."],
                      ["Dam Builder", "When a card bearing this sigil is played, a Dam is created on each empty adjacent space. A Dam is defined as: 0 Power, 2 Health."],
                      ["Hoarder", "When a card bearing this sigil is played, you may search your deck for any card and take it into your hand."],
                      ["Burrower", "When an empty space would be struck, a card bearing this sigil will move to that space to receive the strike instead."],
                      ["Fecundity", "When a card bearing this sigil is played, a copy of it is created in your hand."],
                      ["Loose Tail", "When a card bearing this sigil would be struck, a Tail is created in its place and a card bearing this sigil moves to the right."],
                      ["Corpse Eater", "If a creature that you own perishes by combat, a card bearing this sigil in your hand is automatically played in its place."],
                      ["Bone King", "When a card bearing this sigil dies, 4 bones are awarded instead of 1."],
                      ["Waterborne", "A card bearing this sigil submerges itself during its opponent's turn. While submerged, opposing creatures attack its owner directly."],
                      ["Unkillable", "When a card bearing this sigil perishes, a copy of it is created in your hand."],
                      ["Sharp Quills", "Once a card bearing this sigil is struck, the striker is then dealt a single damage point."],
                      ["Hefty", "At the end of the owner's turn, a card bearing this sigil will move in the direction inscribed in the sigil. Creatures in the way will be pushed in the same direction."],
                      ["Ant Spawner", "When a card bearing this sigil is played, an Ant is created in your hand."],
                      ["Guardian", "When an opposing creature is placed opposite to an empty space, a card bearing this sigil will move to that empty space."],
                      ["Airborne", "A card bearing this sigil will strike an opponent directly, even if there is a creature opposing it."],
                      ["Many Lives", "When a card bearing this sigil is sacrificed it does not perish."],
                      ["Repulsive", "If a creature would attack a card bearing this sigil, it does not."],
                      ["Worthy Sacrifice", "A card bearing this sigil is counted as 3 Blood rather than 1 Blood when sacrificed."],
                      ["Mighty Leap", "A card bearing this sigil will block an opposing creature bearing the Airborne sigil."],
                      ["Bifurcated Strike", "A card bearing this sigil will strike each opposing space to the left and right of the space across from it."],
                      ["Trifurcated Strike", "A card bearing this sigil will strike each opposing space to the left, right, and center of it."],
                      ["Frozen Away", "When a card bearing this sigil perishes, the creature inside is released in its place."],
                      ["Sinkhole", "(No Description)"],
                      ["Bone Digger", "At the end of the owner's turn, a card bearing this sigil will generate 1 Bone."],
                      ["Trinket Bearer", "When a card bearing this sigil is played, you will receive a random item as long as you have less than 3 items."],
                      ["Steel Trap", "When a card bearing this sigil perishes, the creature opposing it perishes as well. A pelt is created in your hand."],
                      ["Amorphous", "When a card bearing this sigil is drawn, this sigil is replaced with another sigil at random."],
                      ["Tidal Lock", "At the beginning of its owner's turn, a card bearing this sigil will pull small creatures, like Squirrels, into its orbit."],
                      ["Moon Strike", "A card bearing this sigil will strike each opposing space that is occupied by a creature. It will strike directly if no creatures oppose it."],
                      ["Leader", "Creatures adjacent to a card bearing this sigil gain 1 power."],
                      ["Brittle", "After attacking, a card bearing this sigil perishes."],
                      ["Skeleton Crew", "At the end of the owner's turn, a card bearing this sigil will move in the direction inscribed in the sigil and drop a Skeleton in its old space."],
                      ["Green Mox", "While a card bearing this sigil is on the board, it provides a Green Gem to its owner."],
                      ["Orange Mox", "While a card bearing this sigil is on the board, it provides an Orange Gem to its owner."],
                      ["Blue Mox", "While a card bearing this sigil is on the board, it provides a Blue Gem to its owner."],
                      ["Gem Animator", "Mox cards on the owner's side of the board gain 1 power."],
                      ["Ruby Heart", "When a card bearing this sigil perishes, a Ruby Mox is created in its place."],
                      ["Mental Gemnastics", "When a card bearing this sigil is played, you draw cards equal to the amount of Mox cards on your side of the board."],
                      ["Gem Dependant", "If a card bearing this sigil's owner controls no Mox cards, a card bearing this sigil perishes."],
                      ["Great Mox", "While a card bearing this sigil is on the board, it provides a Green, Orange, and Blue gem to its owner."],
                      ["Handy", "When a card bearing this sigil is played, discard your hand then draw a new hand of 4 cards."],
                      ["Squirrel Shedder", "At the end of the owner's turn, a card bearing this sigil will move in the direction inscribed in the sigil and drop a Squirrel in their old space."],
                      ["Attack Conduit", "Other creatures within a circuit completed by a card bearing this sigil gain 1 power."],
                      ["Spawn Conduit", "Empty spaces within a circuit completed by a card bearing this sigil spawn L33pB0ts at the end of the owner's turn."],
                      ["Healing Conduit", "Other creatures within a circuit completed by a card bearing this sigil are healed at the end of the owner's turn."],
                      ["Null Conduit", "A card bearing this sigil may complete a circuit, but provides no effect."],
                      ["Battery Bearer", "When a card bearing this sigil is played, it provides an Energy Cell to its owner."],
                      ["Detonator", "When a card bearing this sigil dies, the creature opposing it, as well as adjacent friendly creatures, are dealt 10 damage."],
                      ["Sniper", "You may choose which opposing space a card bearing this sigil strikes."],
                      ["Nano Armor", "The first time a card bearing this sigil would take damage, prevent that damage."],
                      ["Overclocked", "A card bearing this sigil has increased power. But, if a card bearing this sigil perishes, it is permanently removed from your deck."],
                      ["Bomb Latch", "When a card bearing this sigil perishes, its owner chooses a creature to gain the Detonator sigil."],
                      ["Brittle Latch", "When a card bearing this sigil perishes, its owner chooses a creature to gain the Brittle sigil."],
                      ["Shield Latch", "When a card bearing this sigil perishes, its owner chooses a creature to gain the Nano Armor sigil."],
                      ["Dead Byte", "When a card bearing this sigil perishes, select a file. Place damage on the scales according to the file's size."],
                      ["Hostage File", "When a card bearing this sigil perishes the file used to create it is really deleted from your Hard Drive."],
                      ["Transformer", "At the beginning of your turn a card bearing this sigil will transform to, or from, Beast mode."],
                      ["Sentry", "When a creature moves into the space opposing a card bearing this sigil, they are dealt 1 damage."],
                      ["Gem Detonator", "When Gem Vessels on the owner's side of the board die, they Detonate (the creature opposing them, as well as adjacent friendly creatures, are dealt 10 damage)."],
                      ["Gem Guardian", "When a card bearing this sigil is played, all Gem Vessels on the owners' side of the board gain Nano Armor."],
                      ["Vessel Printer", "Once a card bearing this sigil is struck, draw a card from your Empty Vessel pile."],
                      ["Energy Conduit", "If a card bearing this sigil is part of a completed circuit, your Energy never depletes."],
                      ["Bomb Spewer", "When a card bearing this sigil is played, fill all empty spaces with Explode Bots."],
                      ["Handy", "When another creature you own dies, it is returned to life and dies again immediately."],
                      ["Power Dice", "Pay 1 Energy to set the power of a card bearing this sigil randomly between 1 and 6."],
                      ["Activated Random Power Bone", "(No Description)"],
                      ["Enlarge", "Pay 2 Bones to increase the power and health of a card bearing this sigil by 1."],
                      ["Swapper", "After a card bearing this sigil is dealt damage, swap its Power and Health."],
                      ["Disentomb", "Pay 1 Bone to create a Skeleton in your hand."],
                      ["Energy Gun", "Pay 1 Energy to deal 1 damage to the creature across from a card bearing this sigil."],
                      ["Bellist", "When a card bearing this sigil is played, a Chime is created on each empty adjacent space. A Chime is defined as: 0 Power, 1 Health."],
                      ["Annoying", "The creature opposing a card bearing this sigil gains 1 power."],
                      ["Gem Spawn Conduit", "Empty spaces within a circuit completed by a card bearing this sigil spawn Gem Vessels at the end of the owner's turn."],
                      ["Gift Bearer", "When a card bearing this sigil perishes, a random card is created in your hand."],
                      ["Looter", "When a card bearing this sigil deals damage directly, draw a card for each damage dealt."],
                      ["True Scholar", "If you have a Blue gem, sacrifice a card bearing this sigil to draw 3 cards."],
                      ["Stimulate", "Pay 3 Energy to increase the power and health of a card bearing this sigil by 1."],
                      ["Marrow Sucker", "Pay 2 Bones to heal a card bearing this sigil."],
                      ["Stinky", "The creature opposing a card bearing this sigil loses 1 power."],
                      ["Buff When Powered", "If a card bearing this sigil is within a circuit, it gains 2 power."],
                      ["Gift When Powered", "If a card bearing this sigil is within a circuit when it perishes, a random card is created in your hand."],
                      ["Trifurcated When Powered", "If a card bearing this sigil is within a circuit, it will strike each opposing space to the left, right, and center of it."],
                      ["Bonehorn", "Pay 1 Energy to gain 3 Bones."],
                      ["Clinger", "When one of your creatures is placed in a space, a card bearing this sigil will move towards them as far as possible."],
                      ["Waterborne (tentacle)", "A card bearing this sigil submerges itself during its opponent's turn. While submerged, opposing creatures attack its owner directly."],
                      ["Blood Guzzler", "When a creature bearing this sigil deals damage, it gains 1 health for each damage dealt."],
                      ["Haunter", "When a creature bearing this sigil dies, it haunts the space it died in. Creatures played on this space gain its old sigils."],
                      ["Exploding Corpse", "When a creature bearing this sigil dies, all empty spaces on the board are filled with a Guts card."],
                      ["Apparition", "A creature bearing this sigil gains 1 power when you speak 'Bloody Mary' into a connected microphone up to a total of 13 times."],
                      ["Virtual Realist", "If a VR headset is connected, a creature bearing this sigil may be played without paying its cost."],
                      ["Head of Edaxio", "Edaxio is summoned if you control creatures bearing the sigils of Head, Arms, Legs, and Torso of Edaxio."],
                      ["Arms of Edaxio", "Edaxio is summoned if you control creatures bearing the sigils of Head, Arms, Legs, and Torso of Edaxio."],
                      ["Legs of Edaxio", "Edaxio is summoned if you control creatures bearing the sigils of Head, Arms, Legs, and Torso of Edaxio."],
                      ["Torso of Edaxio", "Edaxio is summoned if you control creatures bearing the sigils of Head, Arms, Legs, and Torso of Edaxio."],
                      ["Brood Parasite", "When a card bearing this sigil is played, an egg is created on the opposing space."],
                      ["Double Strike", "A card bearing this sigil will strike the opposing space an extra time when attacking."],
                      ["Scavenger", "While a card bearing this sigil is on the board, opposing creatures also provide bones when perishing."],
                      ["Rampager", "At the end of the owner's turn, a card bearing this sigil will move in the direction inscribed in the sigil. Creatures in the way will be thrown back behind it."],
                      ["Morsel", "When a card bearing this sigil is sacrificed, it adds its stat values to the card it was sacrificed for."],
                      ["Blood Lust", "When a card bearing this sigil attacks an opposing creature and it perishes, this card gains 1 power."],
                      ["Made of Stone", "A card bearing this sigil is immune to the effects of Touch of Death and Stinky."],
                      ["Finical Hatchling", "A card bearing this sigil hatches when drawn if the numbers 1 to 5 are represented in the health of creatures in your deck, and in their power, and if there is a creature of each tribe in your deck."]
                  ],

                  items: [
                      ["Extra Battery", "Battery"],
                      ["Harpie's Birdleg Fan", "BirdLegFan"],
                      ["Magickal Bleach", "BleachPot"],
                      ["Mrs. Bomb's Remote", "BombRemote"],
                      ["Fish Hook", "FishHook"],
                      ["Frozen Opossum Bottle", "FrozenOpossumBottle"],
                      ["Black Goat Bottle", "GoatBottle"],
                      ["Failure", "GooBottle"],
                      ["Hammer", "Hammer"],
                      ["Hourglass", "Hourglass"],
                      ["Magpie's Glass", "MagnifyingGlass"],
                      ["Hoggy Bank", "PiggyBank"],
                      ["Pliers", "Pliers"],
                      ["Wiseclock", "PocketWatch"],
                      ["Scissors", "Scissors"],
                      ["Nano Shield Generator", "ShieldGenerator"],
                      ["Special Dagger", "SpecialDagger"],
                      ["Squirrel in a Bottle", "SquirrelBottle"],
                      ["Boulder in a Bottle", "TerrainBottle"],
                      ["Skinning Knife", "TrapperKnife"]
                  ],

                  tribes: [
                      "Squirrel",
                      "Feathered",
                      "Canine",
                      "Hooved",
                      "Reptilian",
                      "Insectoid"
                  ],

                  boons: [
                      ["Boon of the Ambidextrous", "You may draw twice at the beginning of your turn."],
                      ["Boon of the Magpie's Eye", "When you draw from your deck, you may choose any card in your deck to draw."],
                      ["Boon of the Rabid Squirrel", "Your Squirrels will have 1 power."],
                      ["Boon of Goat's Blood", "You will start a battle with a Black Goat on the board."],
                      ["Boon of the Forest", "You will start a battle with Grand Firs on all of your spaces."],
                      ["Boon of the Bone Lord", "You will start a battle with 8 bones."],
                      // ["Minor Boon of the Bone Lord", "You will start each battle with 1 extra bone."]
                  ],

                  eyeStates: [
                      "Default",
                      "Eye missing",
                      "Magnificus eye inserted",
                      "Goat eye inserted"
                  ],

                  starterDecks: [
                      "Vanilla",
                      "MooseBlood",
                      "Ants",
                      "MantisGod",
                      "SubmergeBirds",
                      "Bones",
                      "FreeReptiles",
                      "HydraEggs"
                  ]
              }
          }
      },

      methods: {
          setTab(n) {
              if (document.forms.main.reportValidity()) {
                  this.tabIndex = n
              }
          },

          async parseFile(file) {
              let text = await file.text()

              // There are a few things we have to do to the input file
              // before we can use it:
              //
              // First, we must replace non-standard JSON values with
              // temporary placeholders; this involves wrapping `$iref`
              // values in quotes and placing actual `x` and `y` keys
              // inside position-style objects.

              text = text
                  .replace(/\$iref:\s*\d+/g, '"$&"')
                  .replace(/"(position|\w*?Position)":\s*{\r?\n?\s*"\$type":\s*(".*?"|-?\d+(?:\.\d+)?),\r?\n?\s*(-?\d+(?:\.\d+)?),\r?\n?\s*(-?\d+(?:\.\d+)?)\r?\n?\s*}/g, '"$1": { "$type": $2, "x": $3, "y": $4 }')

              // Next, we must scan the file for type definitions and
              // replace all references to those types with the internal
              // type string; this is to avoid orphaned type references
              // when removing objects from the file.
              let types = {}

              text = text.replace(/"\$type": (?:(\d+)|"(.*?)")/g, (m, p1, p2) => {
                  if (p1) {
                      return `"$type": "${types[p1]}"`
                  } else {
                      let match = p2.match(/^(\d+)\|(.*)/)

                      if (match) {
                          let id = match[1]
                          let type = match[2]

                          types[id] = type

                          return `"$type": "${type}"`
                      } else {
                          return `"$type": "${p2}"`
                      }
                  }
              })

              try {
                  this.saveFile = JSON.parse(text)
              } catch (e) {
                  alert(e)
                  return
              }

              let decks = [
                  this.saveFile.currentRun.playerDeck,
                  this.saveFile.gbcData.deck,
                  this.saveFile.part3Data.deck,
                  this.saveFile.grimoraData.deck
              ]

              if (this.saveFile.ascensionData?.currentRun) {
                  decks.push(this.saveFile.ascensionData.currentRun.playerDeck)
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
                      if (/^[a-zA-Z0-9_!]+$/.test(modInfo.$k)) {
                          modInfo.$k += "#0"
                      }
                  }

                  let tally = {}

                  deck.cardIdModInfos.$rcontent = deck.cardIds.$rcontent.map(name => {
                      tally[name] ??= 0
                      let search = name + "#" + tally[name]++
                      return deck.cardIdModInfos.$rcontent.find(modInfo => modInfo.$k === search)
                  })

                  // Resolve any irefs for `decalIds`:
                  let decalIds = {}

                  for (let modInfo of deck.cardIdModInfos.$rcontent) {
                      for (let mod of modInfo.$v.$rcontent) {
                          if (typeof mod.decalIds === "string") {
                              let matchInfo = mod.decalIds.match(/^\$iref:(\d+)$/)
                              let id = matchInfo[1]

                              mod.decalIds = decalIds[id]
                          } else {
                              decalIds[mod.decalIds.$id] = mod.decalIds
                          }
                      }
                  }
              }

              // Resolve any irefs in the deathcard mod list to their actual
              // mod info:
              for (let i = 0; i < this.saveFile.deathCardMods.$rlength; ++i) {
                  let mod = this.saveFile.deathCardMods.$rcontent[i]

                  if (typeof mod === "string") {
                      let matchInfo = mod.match(/^\$iref:(\d+)$/)
                      let id = parseInt(matchInfo[1])

                      this.saveFile.deathCardMods.$rcontent[i] = this.saveFile.currentRun.playerDeck.cardIdModInfos.$rcontent
                          .find(modInfo => modInfo.$k.startsWith("!DEATHCARD_BASE") && modInfo.$v.$rcontent[0].$id === id)
                          .$v.$rcontent[0]
                  }
              }

              // Stub boon arrays if they don't already exist:
              this.saveFile.currentRun.playerDeck.boonIds ??= {
                  $type: "System.Collections.Generic.List`1[[DiskCardGame.BoonData+Type, Assembly-CSharp]], mscorlib",
                  $rlength: 0,
                  $rcontent: []
              }

              if (this.saveFile.ascensionData?.currentRun) {
                  this.saveFile.ascensionData.currentRun.playerDeck.boonIds ??= {
                      $type: "System.Collections.Generic.List`1[[DiskCardGame.BoonData+Type, Assembly-CSharp]], mscorlib",
                      $rlength: 0,
                      $rcontent: []
                  }
              }
          },

          createFile() {
              // Change the placeholder values back to the format
              // Inscryption expects:
              let text = JSON.stringify(this.saveFile)
                  .replace(/"(\$iref:\s*\d+)"/g, "$1")
                  .replace(/"(position|\w*?Position)":{"\$type":(".*?"|-?\d+(?:\.\d+)?),"x":(-?\d+(?:\.\d+)?),"y":(-?\d+(?:\.\d+)?)}/g, '"$1":{"$type":$2,$3,$4}')

              let blob = new Blob([text], { type: "application/json" })
              let url = URL.createObjectURL(blob)

              this.$refs.ghostLink.href = url
              this.$refs.ghostLink.click()
          }
      }
  }
</script>

<style scoped>
  #content {
      margin: 1em;
  }
</style>
