# Neo3-GUI

During development process, Neo3-GUI direcelty referece Neo and Neo-cli for faster development experience.  Please use following code to clone Neo3-GUI

```shellhttps://nodejs.org/
git clone --recursive https://github.com/neo-ngd/NEO3-GUI.git
```

## Required Tools and Dependencies

1. [Visual Studio 2019](https://visualstudio.microsoft.com/) and [.NET Core](https://dotnet.microsoft.com/download) 
2. [Node](https://nodejs.org/) 

## Build and Run


Execute these commands in the project's "neo3-gui/neo3-gui/ClientApp" directory:

```
npm install
```

Open "neo3-gui/neo3-gui.sln" with Visual Studio 2019, press "F5" to run.

## Release

Run "neo3-gui/neo3-gui/publish.sh" in shell, and the default release output directory is "neo3-gui/neo3-gui/ClientApp/build-electron". 
