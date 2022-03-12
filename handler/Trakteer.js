const donaturs = require('../database/schema/Donatur');

module.exports = async (client, message) => {
    const embed = message.embeds[0];

    const data = embed.description.split('\n');
    const name = data[0].split('**Nama:** ')[1]?.replace('\n', '');
    const value = parseInt(data[1].split('x').pop());
    const duration = value * 28;
    const toMS = require('ms')(`${duration}d`);

    const members = await message.guild.members.fetch();
    const member = members.find(a => a.user.tag === name);
    if (!member) return client.channels.cache.get('932997960923480097') // deepscan-disable-line
        .send(`Hai Para Staff, ada Donatur yang tidak dapat Kato temui dalam Server, maaf kato tidak dapat memberikan role-nya secara otomatis :(`);

    const role = message.guild.roles.cache.find(r => r.name === 'Santai Dermawan');
    if (!role) return client.channels.cache.get('932997960923480097')
        .send('Hai Para Staff, Role yang kato pasang tidak dapat ditemukan, tolong buatlah Role dengan nama **Santai Dermawan**');

    const findUser = await donaturs.findOne({ userID: member.id });
    if (findUser) {
        await donaturs.findOneAndUpdate({ userID: member.id }, { duration: findUser.duration + toMS });
        client.channels.cache.get('932997960923480099').send(`Hai Para Staff, Donatur **${member.user.tag}** telah diperpanjang durasinya selama **${duration} hari**.`);
        member.send(`Hai ${member.user.tag}, kato telah memperpanjang durasi role kepada kamu selama **${duration} hari**, Terima Kasih atas dukungannya!`);
    } else {
        await donaturs.create({ userID: member.id, guild: message.guild.id, duration: toMS, now: Date.now() });
        member.roles.add(role.id);
        client.channels.cache.get('932997960923480099').send(`Hai Para Staff, **${member.user.tag}** terdaftar sebagai Donatur baru, silahkan cek untuk memastikan!`);
        user.send(`Hai ${member.user.tag}, kato telah memberikan role **Santai Dermawan** kepada Kamu selama **${duration} hari**, Terima Kasih atas dukungannya!`);
    }
}