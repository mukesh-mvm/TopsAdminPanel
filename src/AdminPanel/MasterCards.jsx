
import React from 'react';
import '../Style/MasterCards.css';


const MasterCards = ({ setSelectedTab }) =>
{

    const handleCardClick = (tabKey) =>
    {
        setSelectedTab(tabKey);
    };

    return (
        <div className="master-cards">
            <div className="card" onClick={() => handleCardClick('topShorts')}>
                TopsShorts
            </div>
           
            <div className="card" onClick={() => handleCardClick('trendingShorts')}>
               TrendingShorts
            </div>
           
            <div className="card" onClick={() => handleCardClick('topHeading')}>
                TopHeadingShorts
            </div>

            <div className="card" onClick={() => handleCardClick('dropDown')}>
                Drop Down
            </div>
            
            
            
        </div>
    );
};

export default MasterCards;
