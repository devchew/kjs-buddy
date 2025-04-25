import monte from "./../assets/montecalvaria.png";
import pzm from "./../assets/pzmot.png";
import { EventDetails } from '../types/Event.ts';


export const defaultEvent: EventDetails = {
    cardInfo: {
        name: 'Rally example',
        cardNumber: 1,
        carNumber: 69,
        date: '2021-09-01',
        logo: monte,
        sponsorLogo: pzm,
    },
    panels: [
        {
            number: 1,
            name: '',
            finishTime: 0,
            // 9:30
            provisionalStartTime: 34200000,
            actualStartTime: 34200000,
            drivingTime: 0,
            resultTime: 0,
            nextPKCTime: 0,
            arrivalTime: 0,
        },
        {
            number: 2,
            name: 'PS1 - Example Mountain JW 1',
            finishTime: 0,
            provisionalStartTime: 34200000,
            actualStartTime: 0,
            drivingTime: 1980000,
            resultTime: 0,
            nextPKCTime: 0,
            arrivalTime: 0,
        },
    ],
}
