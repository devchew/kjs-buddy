export type CardInfo = {
  name: string;
  cardNumber: number;
  carNumber: number;
  date: string;
  logo: string;
  sponsorLogo: string;
};
export type CardPanel = {
  number: number;
  name: string;
  finishTime: number;
  provisionalStartTime: number;
  actualStartTime: number;
  drivingTime: number;
  resultTime: number;
  nextPKCTime: number;
  arrivalTime: number;
};

export type Card = {
  cardInfo: CardInfo;
  panels: CardPanel[];
  id: string;
};
