Explorer for Angular 2
---------------------------
Shows how to use all the Wijmo 5 controls in Angular 2 applications.

Steps to install
================
- Install NodeJS https://nodejs.org/, if not installed yet, which is bundled with NPM package manager.
- Run NodeJS command prompt.
- Execute the following commands through command prompt:
> cd "<sample root folder>"
, where <sample root folder> is the one where the package.json file is located.
> npm install
, which installs angular2 and related modules in the sample's node_modules folder,
as well as Wijmo modules from the NpmImages/wijmo-amd-min folder of Wijmo download 
to the node_modules/wijmo folder.

Steps to run
============
Visual Studio users
-------------------
- Make sure that you have installed Visual Studio 2015 Update 3 with TypeScript 2.0.
- Open the solution in Visual Studio IDE and run it.

NodeJS users
------------
Execute the following command in NodeJS command prompt:
> npm start
, which will run the lite-server web server and will open the sample in the default browser.
This command also runs the TypeScript compiler in watch mode that allows you to modify
the .ts files and get their compiled .js versions automatically.

Another environments
--------------------
Host the sample on a Web Server and run its default.htm page in a browser.
