import { useState, useCallback } from 'react';
import NfcManager, { NfcTech, Ndef, NfcEventsResponse, TagEvent } from 'react-native-nfc-manager';
import { Platform, Alert } from 'react-native';
import type { NfcTagData } from '@/components/NfcCard'; // Use type import

// Re-import or define databases here if not globally accessible
// For simplicity, I'll copy the interfaces and assume databases are passed or imported
interface EmvAidInfo {
  aid: string;
  name: string;
}

interface SkylanderInfo {
  id: string; // Hex ID
  name: string;
}

// Assume these are imported or passed to the hook
const emvAidDatabase: EmvAidInfo[] = [
  { aid: 'A00000000305076010', name: 'VISA ELO Credit' },
  { aid: 'A0000000031010', name: 'VISA Debit/Credit (Classic)' },
  { aid: 'A000000003101001', name: 'VISA Credit' },
  { aid: 'A000000003101002', name: 'VISA Debit' },
  { aid: 'A0000000032010', name: 'VISA Electron' },
  { aid: 'A0000000032020', name: 'VISA' },
  { aid: 'A0000000033010', name: 'VISA Interlink' },
  { aid: 'A0000000034010', name: 'VISA Specific' },
  { aid: 'A0000000035010', name: 'VISA Specific' },
  { aid: 'A0000000036010', name: 'Domestic Visa Cash' },
  { aid: 'A0000000036020', name: 'International Visa Cash' },
  { aid: 'A0000000038002', name: 'VISA Auth EMV-CAP (DPA)' },
  { aid: 'A0000000038010', name: 'VISA Plus' },
  { aid: 'A0000000039010', name: 'VISA Loyalty' },
  { aid: 'A000000003999910', name: 'VISA Proprietary ATM' },
  { aid: 'A00000000401', name: 'MasterCard PayPass' },
  { aid: 'A0000000041010', name: 'MasterCard Global' },
  { aid: 'A00000000410101213', name: 'MasterCard Credit' },
  { aid: 'A00000000410101215', name: 'MasterCard Credit' },
  { aid: 'A0000000042010', name: 'MasterCard Specific' },
  { aid: 'A0000000043010', name: 'MasterCard Specific' },
  { aid: 'A0000000043060', name: 'Maestro (Debit)' },
  { aid: 'A000000004306001', name: 'Maestro (Debit)' },
  { aid: 'A0000000044010', name: 'MasterCard Specific' },
  { aid: 'A0000000045010', name: 'MasterCard Specific' },
  { aid: 'A0000000046000', name: 'Cirrus' },
  { aid: 'A0000000048002', name: 'SecureCode EMV-CAP' },
  { aid: 'A0000000049999', name: 'MasterCard PayPass' },
  { aid: 'A0000000050001', name: 'Maestro UK' },
  { aid: 'A0000000050002', name: 'Solo' },
  { aid: 'A00000002401', name: 'Self Service' },
  { aid: 'A000000025', name: 'American Express' },
  { aid: 'A0000000250000', name: 'American Express' },
  { aid: 'A00000002501', name: 'American Express' },
  { aid: 'A000000025010402', name: 'American Express' },
  { aid: 'A000000025010701', name: 'ExpressPay' },
  { aid: 'A000000025010801', name: 'American Express' },
  { aid: 'A0000000291010', name: 'Link / American Express' },
  { aid: 'A0000000421010', name: 'Cartes Bancaire EMV Card' },
  { aid: 'A0000000426010', name: 'Apple Pay' },
  { aid: 'A00000006510', name: 'JCB' },
  { aid: 'A0000000651010', name: 'JCB J Smart Credit' },
  { aid: 'A00000006900', name: 'Moneo' },
  { aid: 'A000000077010000021000000000003B', name: 'Visa AEPN' },
  { aid: 'A000000098', name: 'Debit Card' },
  { aid: 'A0000000980848', name: 'Debit Card' },
  { aid: 'A0000001211010', name: 'Dankort VISA GEM Vision' },
  { aid: 'A0000001410001', name: 'PagoBANCOMAT' },
  { aid: 'A0000001523010', name: 'Discover, Pulse D Pas' },
  { aid: 'A0000001524010', name: 'Discover' },
  { aid: 'A0000001544442', name: 'Banricompras Debito' },
  { aid: 'A000000172950001', name: 'BAROC Taiwan' },
  { aid: 'A0000002281010', name: 'SPAN (M/Chip)' },
  { aid: 'A0000002282010', name: 'SPAN (VIS)' },
  { aid: 'A0000002771010', name: 'INTERAC' },
  { aid: 'A00000031510100528', name: 'Currence PuC' },
  { aid: 'A0000003156020', name: 'Chipknip' },
  { aid: 'A0000003591010028001', name: 'Girocard EAPS' },
  { aid: 'A0000003710001', name: 'InterSwitch Verve Card' },
  { aid: 'A0000004540010', name: 'Etranzact Genesis Card' },
  { aid: 'A0000004540011', name: 'Etranzact Genesis Card 2' },
  { aid: 'A0000004766C', name: 'GOOGLE_PAYMENT' },
  { aid: 'A0000005241010', name: 'RuPay' },
  { aid: 'A0000006472F0001', name: 'FIDO U2F' },
  { aid: 'A0000006723010', name: 'TROY chip credit card' },
  { aid: 'A0000006723020', name: 'TROY chip debit card' },
  { aid: 'A0000007705850', name: 'XTRAPOWER' },
  { aid: 'B012345678', name: 'Maestro TEST' },
  { aid: 'D27600002545500100', name: 'Girocard' },
  { aid: 'D5780000021010', name: 'Bankaxept' },
  { aid: 'F0000000030001', name: 'BRADESCO' },
];

const skylandersDatabase: SkylanderInfo[] = [
  { id: '0000', name: 'Whirlwind' }, { id: '0001', name: 'Sonic Boom' }, { id: '0002', name: 'Warnado' },
  { id: '0003', name: 'Lightning Rod' }, { id: '0004', name: 'Bash' }, { id: '0194', name: 'Bash' },
  { id: '0005', name: 'Terrafin' }, { id: '0006', name: 'Dino-Rang' }, { id: '0007', name: 'Prism Break' },
  { id: '0008', name: 'Sunburn' }, { id: '0009', name: 'Eruptor' }, { id: '000A', name: 'Ignitor' },
  { id: '000B', name: 'Flameslinger' }, { id: '000C', name: 'Zap' }, { id: '000D', name: 'Wham-Shell' },
  { id: '000E', name: 'Gill Grunt' }, { id: '000F', name: 'Slam Bam' }, { id: '0010', name: 'Spyro' },
  { id: '01A0', name: 'Spyro' }, { id: '0011', name: 'Voodood' }, { id: '0012', name: 'Double Trouble' },
  { id: '0013', name: 'Trigger Happy' }, { id: '01A3', name: 'Trigger Happy' }, { id: '0014', name: 'Drobot' },
  { id: '0015', name: 'Drill Sergeant' }, { id: '0016', name: 'Boomer' }, { id: '0017', name: 'Wrecking Ball' },
  { id: '0018', name: 'Camo' }, { id: '0019', name: 'Zook' }, { id: '001A', name: 'Stealth Elf' },
  { id: '001B', name: 'Stump Smash' }, { id: '001C', name: 'Dark Spyro' }, { id: '001D', name: 'Hex' },
  { id: '001E', name: 'Chop Chop' }, { id: '01AE', name: 'Chop Chop' }, { id: '001F', name: 'Ghost Roaster' },
  { id: '0020', name: 'Cynder' }, { id: '0064', name: 'Jet Vac' }, { id: '0065', name: 'Swarm' },
  { id: '0066', name: 'Crusher' }, { id: '0067', name: 'Flashwing' }, { id: '0068', name: 'Hot Head' },
  { id: '0069', name: 'Hot Dog' }, { id: '006A', name: 'Chill' }, { id: '006B', name: 'Thumpback' },
  { id: '006C', name: 'Pop Fizz' }, { id: '006D', name: 'Ninjini' }, { id: '006E', name: 'Bouncer' },
  { id: '006F', name: 'Sprocket' }, { id: '0070', name: 'Tree Rex' }, { id: '0071', name: 'Shroomboom' },
  { id: '0072', name: 'Eye-Brawl' }, { id: '0073', name: 'Fright Rider' }, { id: '00C8', name: 'Anvil Rain' },
  { id: '00C9', name: 'Treasure Chest' }, { id: '00CA', name: 'Healing Elixer' }, { id: '00CB', name: 'Ghost Swords' },
  { id: '00CC', name: 'Time Twister' }, { id: '00CD', name: 'Sky-Iron Shield' }, { id: '00CE', name: 'Winged Boots' },
  { id: '00CF', name: 'Sparx Dragonfly' }, { id: '00D0', name: 'Dragonfire Cannon' }, { id: '00D1', name: 'Scorpion Striker Catapult' },
  { id: '00D2', name: 'Trap - Magic' }, { id: '00D3', name: 'Trap - Water' }, { id: '00D4', name: 'Trap - Air' },
  { id: '00D5', name: 'Trap - Undead' }, { id: '00D6', name: 'Trap - Tech' }, { id: '00D7', name: 'Trap - Fire' },
  { id: '00D8', name: 'Trap - Earth' }, { id: '00D9', name: 'Trap - Life' }, { id: '00DA', name: 'Trap - Light' },
  { id: '00DB', name: 'Trap - Dark' }, { id: '00DC', name: 'Trap - Kaos' }, { id: '00E6', name: 'Hand Of Fate' },
  { id: '00E7', name: 'Piggy Bank' }, { id: '00E8', name: 'Rocket Ram' }, { id: '00E9', name: 'Tiki Speaky' },
  { id: '00EB', name: 'Imaginite Mystery Chest' }, { id: '012C', name: 'Dragons Peak' }, { id: '012D', name: 'Empire of Ice' },
  { id: '012E', name: 'Pirate Seas' }, { id: '012F', name: 'Darklight Crypt' }, { id: '0130', name: 'Volcanic Vault' },
  { id: '0131', name: 'Mirror Of Mystery' }, { id: '0132', name: 'Nightmare Express' }, { id: '0133', name: 'Sunscraper Spire' },
  { id: '0134', name: 'Midnight Museum' }, { id: '01C2', name: 'Gusto' }, { id: '01C3', name: 'Thunderbolt' },
  { id: '01C4', name: 'Fling Kong' }, { id: '01C5', name: 'Blades' }, { id: '01C6', name: 'Wallop' },
  { id: '01C7', name: 'Head Rush' }, { id: '01C8', name: 'Fist Bump' }, { id: '01C9', name: 'Rocky Roll' },
  { id: '01CA', name: 'Wildfire' }, { id: '01CB', name: 'Ka Boom' }, { id: '01CC', name: 'Trail Blazer' },
  { id: '01CD', name: 'Torch' }, { id: '01CE', name: 'Snap Shot' }, { id: '01CF', name: 'Lob Star' },
  { id: '01D0', name: 'Flip Wreck' }, { id: '01D1', name: 'Echo' }, { id: '01D2', name: 'Blastermind' },
  { id: '01D3', name: 'Enigma' }, { id: '01D4', name: 'Deja Vu' }, { id: '01D5', name: 'Cobra Cadabra' },
  { id: '01D6', name: 'Jawbreaker' }, { id: '01D7', name: 'Gearshift' }, { id: '01D8', name: 'Chopper' },
  { id: '01D9', name: 'Tread Head' }, { id: '01DA', name: 'Bushwhack' }, { id: '01DB', name: 'Tuff Luck' },
  { id: '01DC', name: 'Food Fight' }, { id: '01DD', name: 'High Five' }, { id: '01DE', name: 'Krypt King' },
  { id: '01DF', name: 'Short Cut' }, { id: '01E0', name: 'Bat Spin' }, { id: '01E1', name: 'Funny Bone' },
  { id: '01E2', name: 'Knight light' }, { id: '01E3', name: 'Spotlight' }, { id: '01E4', name: 'Knight Mare' },
  { id: '01E5', name: 'Blackout' }, { id: '01F6', name: 'Bop' }, { id: '01F7', name: 'Spry' },
  { id: '01F8', name: 'Hijinx' }, { id: '01F9', name: 'Terrabite' }, { id: '01FA', name: 'Breeze' },
  { id: '01FB', name: 'Weeruptor' }, { id: '01FC', name: 'Pet Vac' }, { id: '01FD', name: 'Small Fry' },
  { id: '01FE', name: 'Drobit' }, { id: '0202', name: 'Gill Runt' }, { id: '0207', name: 'Trigger Snappy' },
  { id: '020E', name: 'Whisper Elf' }, { id: '021C', name: 'Barkley' }, { id: '021D', name: 'Thumpling' },
  { id: '021E', name: 'Mini Jini' }, { id: '021F', name: 'Eye Small' }, { id: '0259', name: 'King Pen' },
  { id: '0265', name: 'Golden Queen' }, { id: '02AD', name: 'Fire Acorn' }, { id: '03E8', name: '(Boom) Jet' },
  { id: '03E9', name: '(Free) Ranger' }, { id: '03EA', name: '(Rubble) Rouser' }, { id: '03EB', name: '(Doom) Stone' },
  { id: '03EC', name: 'Blast Zone' }, { id: '03ED', name: '(Fire) Kraken' }, { id: '03EE', name: '(Stink) Bomb' },
  { id: '03EF', name: '(Grilla) Drilla' }, { id: '03F0', name: '(Hoot) Loop' }, { id: '03F1', name: '(Trap) Shadow' },
  { id: '03F2', name: '(Magna) Charge' }, { id: '03F3', name: '(Spy) Rise' }, { id: '03F4', name: '(Night) Shift' },
  { id: '03F5', name: '(Rattle) Shake' }, { id: '03F6', name: '(Freeze) Blade' }, { id: '03F7', name: 'Wash Buckler' },
  { id: '07D0', name: 'Boom (Jet)' }, { id: '07D1', name: 'Free (Ranger)' }, { id: '07D2', name: 'Rubble (Rouser)' },
  { id: '07D3', name: 'Doom (Stone)' }, { id: '07D4', name: 'Blast Zone (Head)' }, { id: '07D5', name: 'Fire (Kraken)' },
  { id: '07D6', name: 'Stink (Bomb)' }, { id: '07D7', name: 'Grilla (Drilla)' }, { id: '07D8', name: 'Hoot (Loop)' },
  { id: '07D9', name: 'Trap (Shadow)' }, { id: '07DA', name: 'Magna (Charge)' }, { id: '07DB', name: 'Spy (Rise)' },
  { id: '07DC', name: 'Night (Shift)' }, { id: '07DD', name: 'Rattle (Shake)' }, { id: '07DE', name: 'Freeze (Blade)' },
  { id: '07DF', name: 'Wash Buckler (Head)' }, { id: '0BB8', name: 'Scratch' }, { id: '0BB9', name: 'Pop Thorn' },
  { id: '0BBA', name: 'Slobber Tooth' }, { id: '0BBB', name: 'Scorp' }, { id: '0BBC', name: 'Fryno' },
  { id: '0BBD', name: 'Smolderdash' }, { id: '0BBE', name: 'Bumble Blast' }, { id: '0BBF', name: 'Zoo Lou' },
  { id: '0BC0', name: 'Dune Bug' }, { id: '0BC1', name: 'Star Strike' }, { id: '0BC2', name: 'Countdown' },
  { id: '0BC3', name: 'Wind Up' }, { id: '0BC4', name: 'Roller Brawl' }, { id: '0BC5', name: 'Grim Creeper' },
  { id: '0BC6', name: 'Rip Tide' }, { id: '0BC7', name: 'Punk Shock' }, { id: '0C80', name: 'Battle Hammer' },
  { id: '0C81', name: 'Sky Diamond' }, { id: '0C82', name: 'Platinum Sheep' }, { id: '0C83', name: 'Groove Machine' },
  { id: '0C84', name: 'UFO Hat' }, { id: '0C94', name: 'Jet Stream' }, { id: '0C95', name: 'Tomb Buggy' },
  { id: '0C96', name: 'Reef Ripper' }, { id: '0C97', name: 'Burn Cycle' }, { id: '0C98', name: 'Hot Streak' },
  { id: '0C99', name: 'Shark Tank' }, { id: '0C9A', name: 'Thump Truck' }, { id: '0C9B', name: 'Crypt Crusher' },
  { id: '0C9C', name: 'Stealth Stinger' }, { id: '0C9F', name: 'Dive Bomber' }, { id: '0CA0', name: 'Sky Slicer' },
  { id: '0CA1', name: 'Clown Cruiser' }, { id: '0CA2', name: 'Gold Rusher' }, { id: '0CA3', name: 'Shield Striker' },
  { id: '0CA4', name: 'Sun Runner' }, { id: '0CA5', name: 'Sea Shadow' }, { id: '0CA6', name: 'Splatter Splasher' },
  { id: '0CA7', name: 'Soda Skimmer' }, { id: '0CA8', name: 'Barrel Blaster' }, { id: '0CA9', name: 'Buzz Wing' },
  { id: '0CE4', name: 'Sheep Wreck Island' }, { id: '0CE5', name: 'Tower of Time' }, { id: '0CE6', name: 'Fiery Forge' },
  { id: '0CE7', name: 'Arkeyan Crossbow' }, { id: '0D48', name: 'Fiesta' }, { id: '0D49', name: 'High Volt' },
  { id: '0D4A', name: 'Splat' }, { id: '0D4E', name: 'Stormblade' }, { id: '0D53', name: 'Smash It' },
  { id: '0D54', name: 'Spitfire' }, { id: '0D55', name: 'Hurricane Jet-Vac' }, { id: '0D56', name: 'Double Dare Trigger Happy' },
  { id: '0D57', name: 'Super Shot Stealth Elf' }, { id: '0D58', name: 'Shark Shooter Terrafin' }, { id: '0D59', name: 'Bone Bash Roller Brawl' },
  { id: '0D5C', name: 'Big Bubble Pop Fizz' }, { id: '0D5E', name: 'Deep Dive Gill Grunt' }, { id: '0D5F', name: 'Turbo Charge Donkey Kong' },
  { id: '0D60', name: 'Hammer Slam Bowser' }, { id: '0D61', name: 'Dive-Clops' }, { id: '0D62', name: 'Astroblast' },
  { id: '0D63', name: 'Nightfall' }, { id: '0D64', name: 'Thrillipede' }, { id: '0DAC', name: 'Sky Trophy' },
  { id: '0DAD', name: 'Land Trophy' }, { id: '0DAE', name: 'Sea Trophy' }, { id: '0DAF', name: 'Kaos Trophy' },
];


// Helper to convert byte array to hex string
const bytesToHex = (bytes: number[]): string => {
  return bytes.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

export function useRealNfc() {
  const [realTagData, setRealTagData] = useState<NfcTagData | null>(null);
  const [isRealScanning, setIsRealScanning] = useState(false);
  const [nfcStatusMessage, setNfcStatusMessage] = useState<string>('');

  const initNfc = useCallback(async () => {
    try {
      const supported = await NfcManager.isSupported();
      if (!supported) {
        setNfcStatusMessage('NFC não é suportado neste dispositivo.');
        Alert.alert('NFC Não Suportado', 'Este dispositivo não suporta NFC.');
        return false;
      }
      await NfcManager.start();
      setNfcStatusMessage('NFC iniciado. Aproxime uma tag.');
      return true;
    } catch (ex) {
      console.warn('Erro ao iniciar NFC', ex);
      setNfcStatusMessage(`Erro ao iniciar NFC: ${ex}`);
      Alert.alert('Erro NFC', `Não foi possível iniciar o NFC: ${ex}`);
      return false;
    }
  }, []);

  const readNdefTag = useCallback(async () => {
    if (isRealScanning) return;
    setIsRealScanning(true);
    setRealTagData(null);
    setNfcStatusMessage('Tentando ler tag NFC...');

    const nfcReady = await initNfc();
    if (!nfcReady) {
      setIsRealScanning(false);
      return;
    }

    try {
      // Request NDEF technology for reading
      await NfcManager.requestTechnology(NfcTech.Ndef);
      setNfcStatusMessage('Aproxime uma tag NFC para leitura...');

      const tag = await NfcManager.getTag();

      if (tag) {
        setNfcStatusMessage('Tag detectada! Processando...');
        let parsedNdefMessage = '';
        let identifiedType = 'Tag Genérica (Real)';
        let skylanderName: string | undefined = undefined;
        let applicationName: string | undefined = undefined;

        if (tag.ndefMessage && tag.ndefMessage.length > 0) {
          const ndefRecord = tag.ndefMessage[0];
          if (ndefRecord.payload) {
             // NDEF.uri.decodePayload for URLs, NDEF.text.decodePayload for text
            if (ndefRecord.tnf === Ndef.TNF_WELL_KNOWN && Ndef.isUri(ndefRecord)) {
                parsedNdefMessage = Ndef.uri.decodePayload(ndefRecord.payload);
            } else if (ndefRecord.tnf === Ndef.TNF_WELL_KNOWN && Ndef.isText(ndefRecord)) {
                parsedNdefMessage = Ndef.text.decodePayload(ndefRecord.payload);
            } else {
                // Fallback for other NDEF types or just raw payload
                parsedNdefMessage = `Raw NDEF: ${bytesToHex(ndefRecord.payload)}`;
            }
          }
        }
        
        // Attempt to identify based on ID (assuming tag.id is hex for Skylanders or AID for EMV)
        // This part is highly dependent on how tag.id is formatted by react-native-nfc-manager
        // and what data is available on the specific tag being read.
        // For Skylanders, the ID is usually part of the NDEF or a specific memory sector.
        // For EMV, the AID is part of the EMV application selection process.
        // A simple ID match might not be enough.
        
        const tagIdHex = tag.id.toUpperCase(); // Assuming tag.id is a hex string

        const foundSkylander = skylandersDatabase.find(s => s.id.toUpperCase() === tagIdHex);
        if (foundSkylander) {
          identifiedType = "Skylander Figure (Real)";
          skylanderName = foundSkylander.name;
        } else {
          // For EMV, tag.id might be the card serial number, not the AID directly from getTag()
          // A more complex APDU command sequence is usually needed to get AIDs.
          // Here, we'll check if the NDEF message contains an AID or if the ID matches an AID.
          const foundEmv = emvAidDatabase.find(e => tagIdHex.includes(e.aid.toUpperCase()) || (parsedNdefMessage && parsedNdefMessage.toUpperCase().includes(e.aid.toUpperCase())));
          if (foundEmv) {
            identifiedType = "EMV Payment Card (Real)";
            applicationName = foundEmv.name;
          }
        }

        const newTagData: NfcTagData = {
          id: tag.id,
          type: identifiedType,
          skylanderName: skylanderName,
          applicationName: applicationName,
          ndefMessage: parsedNdefMessage || "Nenhuma mensagem NDEF encontrada.",
          techTypes: tag.techTypes || [],
          size: tag.maxSize || undefined,
          isWritable: tag.isWritable || false,
          isFormatted: !!(tag.ndefMessage && tag.ndefMessage.length > 0),
          error: undefined,
        };
        setRealTagData(newTagData);
        setNfcStatusMessage('Tag lida com sucesso!');
      } else {
        setRealTagData({ id: 'error-no-tag', type: 'Erro', error: 'Nenhuma tag encontrada ou tag vazia.' });
        setNfcStatusMessage('Nenhuma tag encontrada.');
      }
    } catch (ex: any) {
      console.warn('Erro ao ler tag NDEF:', ex);
      setRealTagData({ id: 'error-read', type: 'Erro', error: `Falha ao ler tag: ${ex.message || ex}` });
      setNfcStatusMessage(`Erro na leitura: ${ex.message || ex}`);
      if (ex.message && ex.message.includes("cancelled")) {
        setNfcStatusMessage('Leitura cancelada pelo usuário.');
      }
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => console.log('Falha ao cancelar request de tecnologia NFC.'));
      setIsRealScanning(false);
    }
  }, [isRealScanning, initNfc]);

  const cancelRead = useCallback(() => {
    NfcManager.cancelTechnologyRequest().catch(() => console.log('Falha ao cancelar request de tecnologia NFC.'));
    setIsRealScanning(false);
    setNfcStatusMessage('Leitura NFC cancelada.');
  }, []);

  // Clean up NFC manager on unmount (optional, but good practice)
  // useEffect(() => {
  //   initNfc(); // Initialize on mount if desired
  //   return () => {
  //     NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
  //     NfcManager.unregisterTagEvent().catch(() => {});
  //   };
  // }, [initNfc]);

  return {
    realTagData,
    isRealScanning,
    nfcStatusMessage,
    readNdefTag,
    cancelRead,
    initNfc, // Expose initNfc if you want to call it separately
  };
}
