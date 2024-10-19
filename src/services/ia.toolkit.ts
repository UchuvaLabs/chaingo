import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyDQDFt2lmPJ92aFOseX7VMts2_aPgyyvOI');

export const generateIntegrationFunction = async (senderCode: string, receiverCode: string, context: string): Promise<string> => {

  const senderTemplate = `
    // Plantilla para el contrato Sender
    contract Sender {
        function sendToReceiver(address receiver, uint256 amount) public {
            emit Sent(receiver, amount);
        }

        event Sent(address indexed receiver, uint256 amount);
    }
  `;

  const receiverTemplate = `
    // Plantilla para el contrato Receiver
    contract Receiver {
        function receiveFromSender(uint256 amount) public {
            emit Received(msg.sender, amount);
        }

        event Received(address indexed sender, uint256 amount);
    }
  `;


  const prompt = `
    ${context}

    necesito que con una sola palabra me definas esto:
    ${senderCode}

    al igual que esto:
    ${receiverCode}

    lo devuelvas en esta plantilla el sender
    ${senderTemplate}

    y en esta el receiver Receiver:
    ${receiverTemplate}
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    throw new Error('Error generando el código: ' + (error instanceof Error ? error.message : String(error)));
  }
};
