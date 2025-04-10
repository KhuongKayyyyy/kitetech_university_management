import React from 'react';
import { Card } from './card';

interface BriefInformation {
    number: number;
    type: string;
    percentage: string;
    imagePath: string;
}

export const PreviewInformation: React.FC<BriefInformation> = ({ number, type, percentage, imagePath }) => {
    return (
        <Card className='px-5' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <h1 className='text-4xl font-extrabold'>{number}</h1>
                <h2 className='font-semibold'>{type}</h2>
                <h1>
                    <span className="text-green-500">{percentage}</span> <span className="text-gray-500">than last month</span>
                </h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="pl-4">
                <img src={imagePath} alt={type} width={100} height={100} />
            </div>

        </Card>
    );
};
