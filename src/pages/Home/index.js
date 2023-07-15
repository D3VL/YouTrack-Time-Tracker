import React from 'react';

import CurrentTimers from '../../components/CurrentTimers';
import AddNewButton from '../../components/AddNewButton';
import PreviousTimers from '../../components/PreviousTimers';

function Home() {
    return (
        <>
            <section className="p-4">
                <CurrentTimers />
                <AddNewButton />
                <div className="mt-5">
                    <PreviousTimers />
                </div>
            </section>
        </>
    );
}

export default Home;
