import { useState } from "react";
import Layout from "../../components/Layout";
import SettingsLayout from "../../components/SettingsLayout";


function UserSettings() {
    const [menu, setMenu] = useState(true);

    return (
        <Layout>
            <SettingsLayout>
                <div className="w-full h-full">
                    user
                </div>
            </SettingsLayout>
        </Layout>
    )
}

export default UserSettings;