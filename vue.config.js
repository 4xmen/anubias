module.exports = {
    pluginOptions: {
        electronBuilder: {
            preload: './src/preload.js',
            // Or, for multiple preload files:
            builderOptions: {
                "appId": "app.anubias.desktop",
                "productName": "Anubias",
                "copyright": "Copyright © 2021 ${author}",
                "mac": {
                    "target": "dmg",
                    "icon": "./public/icon.icns",
                    "category": "public.app-category.developer-tools"
                },
                "win": {
                    "target": [
                        "msi",
                        "portable",
                        "appx"
                    ],
                    "icon": "./public/256x256.png"
                },
                "linux": {
                    "category": "Development",
                    "target": ["AppImage","Snap",'deb','rpm'],
                    "desktop": "./public/anubias.desktop"
                },
                "snap": {
                    "confinement": "devmode",
                    "publish": "snapStore",
                    "grade": "stable"
                },
                "directories": {
                    "buildResources": "public",
                },
                // "publish": null,
                "fileAssociations": [
                    {
                        "ext": "anb",
                        "name": "Anbuias project",
                        "role": "None",
                        "mimeType": "application/json",
                        "description": "Anubias project file to develop native app anywhere painless"
                    }
                ],
                "extraResources": [
                    {
                        "from": "resources",
                        "to": "resources",
                        "filter": ["**/*"]
                    }
                ],
            },
            "files": [
                "**/*"
            ],

        }
    }
};