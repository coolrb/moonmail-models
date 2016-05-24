import * as chai from 'chai';
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
import * as sinon from 'sinon';
import * as sinonAsPromised from 'sinon-as-promised';
import { Campaign } from '../src/models/campaign';

chai.use(chaiAsPromised);

describe('Campaign', () => {
  const tableName = 'Campaigns-table';
  const campaignId = 'campaignId';
  const userId = 'thatUserId';
  let tNameStub;
  const campaignHashKey = 'userId';
  const campaignRangeKey = 'id';

  before(() => {
    sinon.stub(Campaign, '_client').resolves(true);
    tNameStub = sinon.stub(Campaign, 'tableName', { get: () => tableName});
  });

  describe('#get', () => {
    it('calls the DynamoDB get method with correct params', (done) => {
      Campaign.get(userId, campaignId).then(() => {
        const args = Campaign._client.lastCall.args;
        expect(args[0]).to.equal('get');
        expect(args[1]).to.have.deep.property(`Key.${campaignHashKey}`, userId);
        expect(args[1]).to.have.deep.property(`Key.${campaignRangeKey}`, campaignId);
        expect(args[1]).to.have.property('TableName', tableName);
        done();
      });
    });
  });

  describe('#hashKey', () => {
    it('returns the hash key name', () => {
      expect(Campaign.hashKey).to.equal(campaignHashKey);
    });
  });

  describe('#rangeKey', () => {
    it('returns the range key name', () => {
      expect(Campaign.rangeKey).to.equal(campaignRangeKey);
    });
  });

  after(() => {
    Campaign._client.restore();
    tNameStub.restore();
  });
});