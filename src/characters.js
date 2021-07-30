const cache = {};

function importAll(r) {
  r.keys().forEach((key) => (cache[key] = r(key)));
}
importAll(require.context('./assets/characters', false, /.*/));

export default cache;

// export const charactersManifest = [
//     "001-centaur.svg",
//     "002-kraken.svg",
//     "003-dinosaur.svg",
//     "004-tree-1.svg",
//     "005-hand.svg",
//     "006-echidna.svg",
//     "007-robot.svg",
//     "008-mushroom.svg",
//     "009-harpy.svg",
//     "010-phoenix.svg",
//     "011-dragon-1.svg",
//     "012-devil.svg",
//     "013-troll.svg",
//     "014-alien.svg",
//     "015-minotaur.svg",
//     "016-madre-monte.svg",
//     "017-satyr.svg",
//     "018-karakasakozou.svg",
//     "019-pirate.svg",
//     "020-werewolf.svg",
//     "021-scarecrow.svg",
//     "022-valkyrie.svg",
//     "023-curupira.svg",
//     "024-loch-ness-monster.svg",
//     "025-tree.svg",
//     "026-cerberus.svg",
//     "027-gryphon.svg",
//     "028-mermaid.svg",
//     "029-vampire.svg",
//     "030-goblin.svg",
//     "031-yeti.svg",
//     "032-leprechaun.svg",
//     "033-medusa.svg",
//     "034-chimera.svg",
//     "035-elf.svg",
//     "036-hydra.svg",
//     "037-cyclops.svg",
//     "038-pegasus.svg",
//     "039-narwhal.svg",
//     "040-woodcutter.svg",
//     "041-zombie.svg",
//     "042-dragon.svg",
//     "043-frankenstein.svg",
//     "044-witch.svg",
//     "045-fairy.svg",
//     "046-genie.svg",
//     "047-pinocchio.svg",
//     "048-ghost.svg",
//     "049-wizard.svg",
//     "050-unicorn.svg"]


    