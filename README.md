# Innovation Funding Service (Post Award)

## Installation on Arch Linux

### Prerequisites

- Install a AUR helper, such as [yay](https://github.com/Jguer/yay)
- Be up to date
  ```
  $ yay
  $ yay -S archlinux-keyring
  ```

### Software Installation

```sh
yay -S git firefox visual-studio-code-bin nvm google-chrome
```

## Installation on UKSBS/UKRI/InnovateUK Windows Laptops

Unfortunately, UKSBS provided Windows laptops are very restrictive in terms of permissions; you
will need to work around these restrictions with a series of intricate bodges.

### Prerequisites

- Ensure you have obtained administrator credentials for your laptop.
  This is usually your standard credentials, suffixed with `-la` for local administrator access.
- Be prepared to type in your password a few dozen times.

### Magic Folder

These set of instructions sets up a folder where executables are allowed to be executed.
Without this step, you are not able to run programs in your home directory, even as an administrator.

1. Create a folder in `C:\Program Files`, named `IFSPA`
2. Right click and edit the _Security_ properties of the folder.
   Give _Users_ or _Everyone_ "Full control" permissions for the folder.
3. Create a folder within the `IFSPA` folder named `Downloads`.
   - You will be downloading all installers into this folder.
4. Create a folder within the `IFSPA` folder named `path`.
   - You will be installing global binaries into this folder.
   - Add `C:\Program Files\IFSPA\path` to the System Environment variables `PATH` variable.

### Administrator Terminal

**Top tip!**

The following instructions will require the constant use of your administrator credentials.
Open up an administrator terminal prompt without closing it.

You can then move to the downloads folder.

In an administrator command prompt (preferably not PowerShell), go to the `C:\Program Files\IFSPA\Downloads` folder.

```cmd
cd %ProgramFiles%\IFSPA
```

### Environment Variables

To edit your environment variables, run the following command in your [Administrator Terminal](#administrator-terminal)

```cmd
rundll32 sysdm.cpl,EditEnvironmentVariables
```

Restart instances of Visual Studio Code/terminals to re-initialise the env-vars within those programs.

### Software Installation

This section will install the following programs. Skip non-required sections as necessary.

| Name                                                | Required to code | Description                                  | Note                                                                               |
| --------------------------------------------------- | ---------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| [Windows Terminal](#windows-terminal)               | [ ]              | Good riddance to `cmd.exe`                   |                                                                                    |
| [Visual Studio Code](#visual-studio-code)           | [x]              | A text editor by Microsoft                   | You **must** download the _System Installer_. **Do not** use the _User Installer_. |
| [Git](#git-for-windows)                             | [x]              | Version control software                     | SSH is not supported whilst in Polaris House. See more info in install section     |
| [Node Version Switcher](#node-version-switcher)     | [x]              | A Windows equivalent of Node Version Manager |                                                                                    |
| [Google Chrome](#google-chrome-and-mozilla-firefox) | [x]              | Web browser                                  | Some extensions may be blocked. See more info in install section                   |
| [Firefox](#google-chrome-and-mozilla-firefox)       | [x]              | Web browser                                  | Some extensions may be blocked. See more info in install section                   |
| [ShareX](#sharex)                                   | [ ]              | Screenshot/Screen video recorder             |                                                                                    |
| [GraphQL Playground](#graphql-playground)           | [ ]              | A place to try out GraphQL queries           |                                                                                    |
| [Cypress](#)                                        | [x]              | Automated browser regression testing         |                                                                                    |

<small>(N.B. **It is not possible** to download some of these from the Microsoft Store, as it has been disabled by UKRI.)</small>

#### Windows Terminal

| Download Link                                  | Note                                              |
| ---------------------------------------------- | ------------------------------------------------- |
| https://github.com/microsoft/terminal/releases | Don't accidentally install the Windows 11 version |

Double click the `.msixbundle` file to install. You do not need to be an administrator.

#### Visual Studio Code

| Download Link                          | Note                                                            |
| -------------------------------------- | --------------------------------------------------------------- |
| https://code.visualstudio.com/download | Use the _System Installer_. **Do not** use the _User Installer_ |

Within your [administrator terminal prompt](#administrator-terminal), run the `VSCodeSetup-x64-[version number here].exe` file.

```cmd
VSCodeSetup-x64-0.00.0.exe
```

#### Git for Windows

| Download Link                    | Note |
| -------------------------------- | ---- |
| https://git-scm.com/download/win |      |

Within your [administrator terminal prompt](#administrator-terminal), run the `Git-[version number here]-64-bit.exe` file.

```cmd
Git-2.38.1-64-bit.exe
```

During the installation, set the following...

- The preferred default branch name is `develop`
- Use the built in OpenSSH to Windows.
- You can set the default text editor to _Visual Studio Code_, or your other favourite editor like `neovim` or `nano`.

> You may need to restart your [administrator terminal prompt](#administrator-terminal).

#### Node Version Switcher

| Download Link               | Note                                                                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Git clone - Read more below | The following instructions are based on the [original NVS setup instructions](https://github.com/jasongin/nvs/blob/master/doc/SETUP.md). |

1. Specify the installation path

```cmd
set NVS_HOME=%ProgramFiles%\IFSPA\nvs
```

2. Clone the NVS repo:

```cmd
git clone https://github.com/jasongin/nvs "%NVS_HOME%"
```

3. Run the `install` command:

```cmd
"%NVS_HOME%\nvs.cmd" install
```

> You may need to restart your [administrator terminal prompt](#administrator-terminal).

4. Install the current version of Node.js, in a standard (non-administrator) terminal prompt, and set the version as default

```sh
nvs use 14.15.4
nvs link 14.15.4
```

#### Google Chrome and Mozilla Firefox

| Download Link                              | Note                                                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Chrome should already be pre-installed     |                                                                                             |
| https://www.mozilla.org/en-GB/firefox/new/ | Do not attempt to install the Microsoft Store version. The store has been disabled by UKRI. |

Within your [administrator terminal prompt](#administrator-terminal), run the `Firefox Installer.exe` file.

```cmd
"Firefox Installer.exe"
```

Some extensions may be disabled on UKRI laptops. To temporarily remove this block...

1. Open `regedit.exe` as an administrator

2. Delete the following record that currently has the following value...

```reg
HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallBlocklist\1
```

```
*
```

3. Set the following key with the following value...

```reg
HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Mozilla\Firefox\ExtensionSettings
```

```json
{}
```

4. You can now install extensions. We recommend the following extensions...

| Name                  | Required to develop | Description                                                                  | Mozilla Firefox                                                | Google Chrome                                                                                    |
| --------------------- | ------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| React Developer Tools | [x]                 | Tools to help debug React websites                                           | https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/ | https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi |
| Redux DevTools        | [x]                 | Tools to help debug the Redux store                                          | https://addons.mozilla.org/en-GB/firefox/addon/reduxdevtools/  | https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd        |
| uBlock Origin         | [ ]                 | Ad blocker, but mainly used for testing for JavaScript disabled environments | https://addons.mozilla.org/en-GB/firefox/addon/ublock-origin/  | https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm         |

#### ShareX

ShareX is an open source screenshot, screen-capture and general productivity tool.

| Download Link                    | Note                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| https://getsharex.com/           | Do not attempt to install the Microsoft Store version. The store has been disabled by UKRI. |
| https://ffmpeg.org/download.html | Required to create screen captures in both video and `.gif` format.                         |

1. Within your [administrator terminal prompt](#administrator-terminal), run the `ShareX-[version number here]-setup.exe` file.

```cmd
ShareX-00.0.0-setup.exe
```

2. Extract the _ffmpeg_ binaries from the zip file (inside `ffmpeg-[date]-git-[hash]-essentials_build.zip\ffmpeg-[date]-git-[hash]-essentials_build\bin\`) into the `C:\Program Files\IFSPA\path` folder.
3. Open the ShareX _Task Settings_ by right-clicking the tray icon, or within the ShareX window, if it is opened.
4. Under _Screen Recorder_, press on the _Screen recording options..._ button.
5. Press _Install Recorder Devices_
6. Close ShareX completely, by right clicking the system tray and pressing _Exit_
7. Re-open ShareX. ShareX should now be running under a non-administrator account.
8. Open the ShareX _Task Settings_ by right-clicking the tray icon, or within the ShareX window, if it is opened.
9. Enter the following under _FFmpeg path_

```
C:\Program Files\IFSPA\path\ffmpeg.exe
```

10. Optionally, you can now configure ShareX to however you like it. The following are recommended.

- Autostart, under _Application Settings_ > _Integration_ > _Run ShareX when Windows starts_
- Hotkey settings, under _Hotkey Settings..._

#### GraphQL Playground

| Download Link                                          | Notes                                       |
| ------------------------------------------------------ | ------------------------------------------- |
| https://github.com/graphql/graphql-playground/releases | Don't try to find this on Apollo's website. |

Within your [administrator terminal prompt](#administrator-terminal), run the `graphql-playground-electron-setup-[version number here].exe` file.

```cmd
graphql-playground-electron-setup-1.8.10.exe
```

Point your GraphQL playground to one of the following, depending on what you need...

```
http://localhost:8080/graphql
http://127.0.0.1:8080/graphql
https://www-acc-dev.apps.ocp4.innovateuk.ukri.org/graphql
```

#### Cypress

> Note. This step depends on you having [cloned the repository](#clone-the-repository).

Before running `npm i` within the `/cypress-test` folder, set the following [environment variable](#environment-variables) as...

```
CYPRESS_CACHE_FOLDER=C:\Program Files\IFSPA\cypress
```

## Clone the repository

> Note. This step depends on you having [Git for Windows](#git-for-windows) or Git on your Linux/Mac computer.

Unfortunately, SSH is blocked within Polaris House. This means you must use HTTPS for your Git needs.

1. Go to https://bitbucket.org/ukri-ddat/acc-ui/src/develop/
2. Click on the _Clone_ button - Copy this link, but don't run the command yet!
   - You will need this link later.
   - It should be in the form...
     ```
     git clone https://user-[weird chars]@bitbucket.org/ukri-ddat/acc-ui.git
     ```
3. Go to https://bitbucket.org/account/settings/app-passwords/
4. Create an app password.
5. Copy and paste the app password into the previously copied link, such that it now reads...

   ```
   git clone https://user-[weird chars]:[password]@bitbucket.org/ukri-ddat/acc-ui.git
   ```

   > Note the `:` added between your username part; this is very very necessary.

## Secrets

In order to build the Node.js service, you'll need to get a secret created on your Openshift project.
You will need to do this manually and once only. You run it as follows:

```sh
oc create secret generic shibsigningkey --from-file=signing.key=[path-to-shib-signing-key.key]
oc create secret generic sfsigningkey --from-file=signing.key=[path-to-sf-signing-key.key]
```

The path is to the file containing your key so will need to change accordingly. Leave the rest as it is.

### Non-SSO Development

> Note. This step depends on you having [cloned the repository](#clone-the-repository)

To develop locally without SSO...

1. Move your command prompt to the `/app` folder.
2. Ask a co-worker for their `.env` file.
   This `.env` file should have been passed through generations of developers.
   Keep it safe, by placing it in the `/app` folder.
3. Run `npm i`
4. Run `npm start` to start `esbuild`.
   The webserver should be ready at https://localhost:8080/

### SSO Development

Developing locally for single sign-on (SSO) requires a HTTPS server to be run on local host.
You will need the certificate and private key stored under `/security` as `AccLocalDevCert.crt` and `AccLocalDevKey.key` respectively.

The following key-values will need to be set in your .env file.

```ini
USE_SSO=true
SERVER_URL=http://localhost:8080
SSO_PROVIDER_URL=https://auth-acc-ifsdev.apps.org-env-0.org.innovateuk.ukri.org/idp/profile/SAML2/Redirect/SSO
SSO_SIGNOUT_URL=https://acc-ifsdev.apps.org-env-0.org.innovateuk.ukri.org/Logout
IFS_ROOT=https://acc-ifsdev.apps.org-env-0.org.innovateuk.ukri.org
```

Then run `npm run start:dev -- --secure`. The site will be available on `https://localhost:8080` with SSO enabled.

## Run unit tests

1. Ensure the server is running with `npm run serve` from the `/app` directory
2. Run `npm run test`
3. After the tests complete will give you the output location of your report

## Run API & UI tests

1. Ensure the server is running with `npm run serve` from the `/app` directory
2. Navigate to `test-framework` from repository root
3. Run `npm install` to install dependencies
4. Run `npm run build`
5. Run `npm run test`
6. After tests have completed the process will give you output location of the report

## Debugging

### Server-side code

When running `npm run start`, the server process is available to be attached to and debugged.
To enable automatically attaching in Visual Studio Code...

1. In the command palette, run...
   ```
   > Debug: Toggle Auto Attach
   ```

2. Select _Only With Flag_

### Client-side code

To help aid debug client-side code...

- The build commit name, branch name and time is found within the top of the HTML document as a HTML comment.
- Many elements include `data-qa=` tags, which you can use to `CTRL+F` your way to the correct file
- A `<div />` at the top of the page includes a `data-page-qa=` tag to tell you what page is currently being rendered, which you can also use to `CTRL+F` your way to the correct file.
- Use your debugger in your web browser; all sourcemaps are available to you to add breakpoints.
- Use the aptly named _IFS PA Developer & Testing Tools_ at the bottom of the page to switch between Salesforce accounts.

## Footnote

Please note there is further documentation about the application in relevant subfolders, such as /testframework.
