'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const _ = require('lodash');
module.exports = {
  async getStatusTable(ctx) {
    const { company } = ctx.params;
    let companyVotes = await strapi.services['user-prediction'].findCompanyVotes({
      Company: company
    });
    let table = {}

    const getWinner1x2 = (hts, ats) => {
      const h = parseInt(hts)
      const a = parseInt(ats)
      if (h > a) {
        return '1'
      } else if (h < a) {
        return '2'
      } else {
        return 'X'
      }
    }
    

    for(const vote of companyVotes){

      let totalPoints = 0
      let correctScorePts = 0
      let correctResultsPts = 0
      
      let hts = vote.Game.HomeTeamScore
      let ats = vote.Game.AwayTeamScore
      let predictedHts = vote.HomeTeamScore
      let predictedAts = vote.AwayTeamScore

      if(hts !== null || ats !== null) {
        // Check if results correct
        const actualResults = getWinner1x2(hts, ats)
        const myPredictedResults = getWinner1x2(predictedHts, predictedAts)
        if (actualResults === myPredictedResults) {
          correctResultsPts = 1
        }
        // Check if score correct
        if (hts === predictedHts && ats === predictedAts) {
          correctScorePts = 3
        }
      }
      totalPoints += correctResultsPts + correctScorePts
      let voteResult = {
        game: vote.Game.id,
        correctScorePts: correctScorePts,
        correctResultsPts: correctResultsPts,
        totalPoints: totalPoints
      }
      if(table[vote.User.id] === undefined) {
        table[vote.User.id] = []
        table[vote.User.id].push(voteResult)

      } else {
        table[vote.User.id].push(voteResult)
      }
    }

    ctx.send(table);
  }
};
