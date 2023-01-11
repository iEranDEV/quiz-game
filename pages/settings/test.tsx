import { useState } from "react";
import Layout from "../../components/Layout";
import SettingsLayout from "../../components/SettingsLayout";


function TestSettings() {
    const [menu, setMenu] = useState(true);

    return (
        <Layout>
            <SettingsLayout>
                <div className="w-full h-full px-4">
                    <p>{'tu cos zrobie dzisiaj :* <3'}</p>
                </div>
            </SettingsLayout>
        </Layout>
    )
}

export default TestSettings;