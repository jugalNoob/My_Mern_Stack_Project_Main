
import  {sendMessage} from '../../Producer/Prodcuer.SendMess/Message.js'
import {initProducer} from '../../Producer/Produer.Init/Prodcuer.js'


export const prodcuerService = async (data) => {

    try {
          return await  sendMessage(data);

    } catch (error) {
    console.log(error)
    }

};


initProducer()