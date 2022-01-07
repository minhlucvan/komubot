const reportDaily = require("../../util/reportdaily");
const { reportWfh, reportCompalinWfh } = require("../../util/reportWfh");

function getTimeWeekMondayToFriday(dayNow) {
  let curr = new Date();
  // current date of week
  let currentWeekDay = curr.getDay();
  let lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
  let firstweek = new Date(new Date(curr).setDate(curr.getDate() - lessDays));
  let arrayDay;
  if (dayNow === 0 || dayNow === 6 || dayNow === 5) {
    arrayDay = [2, 3, 4, 5, 6];
  } else {
    arrayDay = Array.from({ length: dayNow }, (v, i) => i + 2);
  }
  function getDayofWeek(rank) {
    // rank 2 -> 6 (Monday -> Friday)
    return new Date(
      new Date(firstweek).setDate(firstweek.getDate() + rank - 2)
    );
  }
  return arrayDay.map((item) => getDayofWeek(item));
}

module.exports = {
  name: "report",
  description: "show no daily",
  cat: "komu",
  async execute(message, args, client, guildDB) {
    try {
      if (args[0] === "daily") {
        await reportDaily(null, message, args, client, guildDB);
      } else if (args[0] === "weekly") {
        for (day of getTimeWeekMondayToFriday(new Date().getDay())) {
          await reportDaily(day, message, args, client, guildDB);
        }
      } else if (args[0] === "wfh" && args[1] === "complain") {
        await reportCompalinWfh(message, args, client, guildDB);
      } else if (args[0] === "wfh") {
        await reportWfh(message, args, client, guildDB);
      } else if (args[0] === "help") {
        return message.channel
          .send(
            "```" +
              "*report options" +
              "\n" +
              "options  " +
              "\n" +
              [
                { name: "daily", des: "show daily today" },
                { name: "weekly", des: "show daily weekly" },
                {
                  name: "wfh ",
                  des: "show user don't reply to bot ",
                },
                {
                  name: "wfh complain",
                  des: "show user don't reply to bot & pm confirm",
                },
              ]
                .map((item) => `- ${item.name} : ${item.des}`)
                .join("\n") +
              "```"
          )
          .catch(console.error);
      } else {
        return message.channel
          .send("```" + "*report help" + "```")
          .catch(console.error);
      }
    } catch (error) {
      console.log(error);
    }
  },
};
