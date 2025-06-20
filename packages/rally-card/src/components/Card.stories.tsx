import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './Card';
import { CardProvider, useCardContext } from '../contexts/CardContext';
import { type FunctionComponent, type PropsWithChildren, useEffect } from 'react';

import type { Card as CartType } from '../types/Card.ts';


const mockCard = {"cardInfo":{"name":"Rally Monte Calvaria","cardNumber":1,"carNumber":169,"date":"2025-04-26","logo":"montecalvaria.png","sponsorLogo":"pzmot.png"},"panels":[{"number":1,"name":"","finishTime":0,"provisionalStartTime":34200000,"actualStartTime":34200000,"drivingTime":0,"resultTime":0,"nextPKCTime":0,"arrivalTime":0},{"number":2,"name":"PS1","finishTime":0,"provisionalStartTime":0,"actualStartTime":0,"drivingTime":0,"resultTime":0,"nextPKCTime":0,"arrivalTime":0},{"number":3,"name":"PS2","finishTime":0,"provisionalStartTime":0,"actualStartTime":0,"drivingTime":0,"resultTime":0,"nextPKCTime":0,"arrivalTime":0},{"number":4,"name":"PS3","finishTime":0,"provisionalStartTime":0,"actualStartTime":0,"drivingTime":0,"resultTime":0,"nextPKCTime":0,"arrivalTime":0},{"number":5,"name":"PS4","finishTime":0,"provisionalStartTime":0,"actualStartTime":0,"drivingTime":0,"resultTime":0,"nextPKCTime":0,"arrivalTime":0},{"number":6,"name":"PS5","finishTime":0,"provisionalStartTime":0,"actualStartTime":0,"drivingTime":0,"resultTime":0,"nextPKCTime":0,"arrivalTime":0},{"number":7,"name":"PS6","finishTime":0,"provisionalStartTime":0,"actualStartTime":0,"drivingTime":0,"resultTime":0,"nextPKCTime":0,"arrivalTime":0}],"lastUsed":1746866850909,"id":"0a83673b-4869-4a11-9372-3c3b7419fe47"};


type ContextProps = {
    card: CartType;
    editMode?: boolean;
}

const CardWithPredefinedData: FunctionComponent<PropsWithChildren<ContextProps>> = ({card, editMode}) => {
    const {updateCard, setIsEditMode} = useCardContext();

    useEffect(() => {
        updateCard(card);
    }, [card]);

    useEffect(() => {
        setIsEditMode(editMode ?? false);
    }, [editMode]);

    return (<Card />);
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Card',
    component: CardWithPredefinedData,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
                    <CardProvider>
                        <Story />
                    </CardProvider>
            </div>
        ),
    ],
} satisfies Meta<typeof CardWithPredefinedData>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        card: mockCard,
    },
};

export const Empty: Story = {
    args: {
        card: {
            cardInfo: mockCard.cardInfo,
            panels: [],
            id: '',
        },
    },
};

export const EditMode: Story = {
    args: {
        card: mockCard,
        editMode: true,
    },
};
