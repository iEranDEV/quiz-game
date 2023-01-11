import { useState } from "react";
import Layout from "../../components/Layout";
import SettingsLayout from "../../components/SettingsLayout";


function TestSettings() {
    const [menu, setMenu] = useState(true);

    return (
        <Layout>
            <SettingsLayout>
                <div className="w-full h-full">
                </div>
            </SettingsLayout>
        </Layout>
    )
}

export default TestSettings;