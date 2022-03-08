const wfh = require('../../util/wfh.js');
const queryString = require('query-string');
const {
  addScores,
  saveQuestionInCorrect,
  saveQuestionCorrect,
} = require('../../util/quiz');
const userData = require('../../models/userData');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const userQuizData = require('../../models/userQuiz');
const womenDayData = require('../../models/womenDayData');
const { sendMessageToNhaCuaChung } = require('../../util/komubotrest');
const newEmbed = (message, color) =>
  new MessageEmbed().setTitle(message).setColor(color);

module.exports = {
  async execute(interaction, client) {
    if (interaction.isButton()) {
      // handle wfh button
      if (interaction.customId.startsWith('komu_')) {
        await wfh(interaction, client).catch(console.error);
        return;
      }
      if (interaction.customId.startsWith('question_')) {
        const { id, key, correct, userid } = queryString.parse(
          interaction.customId
        );
        const userquiz = await userQuizData.findOne({
          userid,
          quizid: id,
        });
        if (userquiz) {
          await interaction.reply('You have answered this question before!');
          return;
        }
        if (key == correct) {
          const newUser = await addScores(userid);
          if (!newUser) return;
          await saveQuestionCorrect(userid, id, key);

          const EmbedCorrect = newEmbed(
            `Correct!!!, you have ${newUser.scores_quiz} points`,
            'GREEN'
          );
          await interaction.reply({ embeds: [EmbedCorrect] });
        } else {
          await saveQuestionInCorrect(userid, id, key);
          const EmbedInCorrect = newEmbed(
            `Incorrect!!!, The correct answer is ${correct}`,
            'RED'
          );
          await interaction.reply({ embeds: [EmbedInCorrect] });
        }

        await interaction.message.edit({
          components: [],
        });

        await userData.updateOne(
          { id: userid },
          {
            last_message_id: interaction.message.id,
          }
        );
      }
      if (interaction.customId.startsWith('8/3_')) {
        await interaction.message.edit({
          components: [],
        });

        const { userid } = queryString.parse(interaction.customId);

        const randomIndex = () => {
          const min = 0;
          const max = 5;
          const intNumber = Math.floor(Math.random() * (max - min)) + min;
          return intNumber;
        };

        const gift = [
          'tà tưa fun tốp ping trị giá 4.38$',
          'một bé gấu bông sô ciu giá 8.76$',
          'cái nịt',
          'cái nịt',
          'cái nịt',
        ];

        let giftRandom = gift[randomIndex()];

        if (
          giftRandom === 'tà tưa fun tốp ping trị giá 4.38$' ||
          giftRandom === 'một bé gấu bông sô ciu giá 8.76$'
        ) {
          const newGift = new womenDayData({
            userid: userid,
            win: true,
            gift: giftRandom,
          });
          await newGift.save();
        } else {
          const newGift = new womenDayData({
            userid: userid,
            win: false,
            gift: giftRandom,
          });
          await newGift.save();
        }

        interaction.reply(`Chúc mừng bạn nhận được ${giftRandom}`);

        await sendMessageToNhaCuaChung(
          client,
          `Chúc mừng <@!${userid}> đã nhận được món quà 8/3 siêu to khổng lồ đó là ${giftRandom}`
        );
      }
    }
    if (!interaction.isCommand()) return;
    const slashcmdexec = client.slashexeccommands.get(interaction.commandName);
    // await interaction.deferReply();
    if (slashcmdexec != null && slashcmdexec != undefined) {
      slashcmdexec(interaction, client).catch(console.error);
    } else {
      await interaction.reply({
        content: '`❌` Slash commands are under construction.\n',
        ephemeral: true,
      });
    }
    // await interaction.editReply("Done");
  },
};
