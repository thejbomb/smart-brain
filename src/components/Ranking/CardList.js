import React from 'react';
import Card from './Card'

const CardList = ({ users }) => {
    return (
        <div>
                    <Card
                        name={users}
                        //entries={users[i].entries}
                    />
            
        </div>
    )
}

export default CardList;