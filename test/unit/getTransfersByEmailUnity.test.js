// getTransfers.test.js
const resolvers = require('../../resolvers');

const { getTransfersByEmail } = resolvers.Query;

describe('getTransfersByEmail resolver', () => {
  let transfersCollectionMock;
  let cursorMock;

  beforeEach(() => {
    cursorMock = {
      toArray: jest.fn(),
    };

    transfersCollectionMock = {
      find: jest.fn().mockReturnValue(cursorMock), 
    };
  });

  it('should retrieve transfers successfully', async () => {
    const expectedTransfers = [
      {
        fromEmail: "from@from.com",
        toEmail: "to@to.com",
        amount: 50,
      },
      {
        fromEmail: "from@from.com",
        toEmail: "jane.smith@example.com",
        amount: 75,
      }
    ];

    cursorMock.toArray.mockResolvedValueOnce(expectedTransfers);

    const getTransfersResponse = await getTransfersByEmail(null, { email: expectedTransfers[0].fromEmail }, { transfersCollection: transfersCollectionMock });
;
    expect(getTransfersResponse).toEqual(expectedTransfers);
  });
});
