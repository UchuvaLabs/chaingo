import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyDQDFt2lmPJ92aFOseX7VMts2_aPgyyvOI');

interface ModelResponse {
  response: {
    text: () => string; 
  };
}

export const generateIntegrationFunction = async (
  senderCode: string,
  receiverCode: string,
  context: string,
  receiverChainId: string 
): Promise<{ senderFile: string; receiverFile: string }> => {

  const senderTemplate = `
    // Plantilla para el contrato Sender
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.18;

    contract Sender {
        function sendToReceiver(address receiver, uint256 amount) public {
            emit Sent(receiver, amount);
        }

        event Sent(address indexed receiver, uint256 amount);
    }
  `;

  const receiverTemplate = `
    // Plantilla para el contrato Receiver
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.18;

    contract Receiver {
        function receiveFromSender(uint256 amount) public {
            emit Received(msg.sender, amount);
        }

        event Received(address indexed sender, uint256 amount);
    }
  `;

  
  const prompt = `
  Contexto:
  ${context}

  El Chain ID correspondiente al contrato que recibe es: ${receiverChainId}

  Por favor, toma el siguiente código del contrato de Sender:
  ${senderCode}

  Asegúrate de integrar la plantilla correspondiente al contrato Sender sin alterar la lógica original del usuario. 
  Aquí está la plantilla para el contrato Sender:
  ${senderTemplate}

  Ahora, toma el siguiente código del contrato de Receiver:
  ${receiverCode}

  Realiza lo mismo que hiciste con el contrato Sender: integra la plantilla correspondiente al contrato Receiver, sin alterar la lógica original del usuario.

  Aquí está la plantilla para el contrato Receiver:
  ${receiverTemplate}
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt) as ModelResponse;

    if (!result.response || typeof result.response.text !== 'function') {
      throw new Error('No se recibió una respuesta válida del modelo.');
    }

    const responseText = result.response.text(); 
    const contracts = responseText.split('\n\n'); 
    if (contracts.length < 2) {
      throw new Error('No se encontraron suficientes contratos en la respuesta.');
    }

    return {
      senderFile: contracts[0].trim(),  
      receiverFile: contracts[1].trim(), 
    };
  } catch (error) {
    throw new Error('Error generando los contratos: ' + (error instanceof Error ? error.message : String(error)));
  }
};
