# Neo3-GUI

Neo-GUI for neo3 is still under development, we will keep adding features and improving user experience along with the development of neo3. 

Your feedbacks and suggestions are welcome. Please submit issues.

## Required Tools and Dependencies for development

1. [Visual Studio 2019](https://visualstudio.microsoft.com/) and [.NET Core 3.1](https://dotnet.microsoft.com/download) 
2. [Node.js](https://nodejs.org/) 

## Build and Run

### Install Front-End dependencies
To install all the JS dependencies required for Neo3-GUI, please run the following commands in the project's `neo3-gui/neo3-gui/ClientApp` directory:

```
npm install
```

### Run Neo3-GUI
After successfully install JS dependencies, you can start runing or debugging Neo3-GUI with Visual Studio.

Open `./neo3-gui/neo3-gui.sln` with Visual Studio 2019, press **F5** to start debuging Neo3-GUI.

## Release
To release and publish an installation program for Neo3-GUI, please run the following comment in `neo3-gui/neo3-gui` directory:
```
./publish.sh
```
Once the script runs success,  the installation program will be in the default release output directory is `neo3-gui/neo3-gui/ClientApp/build-electron`. 
