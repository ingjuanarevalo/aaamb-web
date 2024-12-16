# AAAMB LLC WEB - Technical Test for MEAN job position

This project is a SPA (Single Page Application) created with Angular 19 to work as the frontend for a Task Manager application.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.5.

## Prerequisites to run this Angular Project

You need to have installed NodeJS version 22.12.0

## Steps to deploy the Angular Project in a local environment from scratch

Run the following commands inside the project folder, in order, one by one:

```bash
npm i -g @angular/cli@19.0.5
npm i
npm start
```

If you already have installed `@angular/cli@19.0.5` and all the npm local dependencies, just run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`

## Angular Project Description

This Angular application utilizes some additional libraries, such as:

- **Angular Material:** for advanced UI components.
- **Luxon:** for date management.
- **Bootstrap:** for responsive column layout.
- **Lodash:** for efficient array and object manipulation.

The project files are organized into folders, following a consistent naming standard. In the `src/app` folder, you'll find subfolders like
`components`, `enums`, `interfaces`, `pages`, `services` and `validators`, each serving a specific purpose:

- **components:** Reusable components.
- **enums:** Enumerations.
- **interfaces:** Interface definitions.
- **pages:** Pages accessible via routes.
- **services:** Services encapsulating business logic.
- **validators:** Custom validators.

### Key Files

- **`app.config.ts`:** This file configures essential provider imports, such as `HttpClient` for HTTP requests and a **Luxon** date adapter that
  integrates with the **MatDatePicker** component from **Angular Material**.
- **`app.routes.ts`:** This file defines the project's single route, which points to the `TasksComponent` the main view of the application.

### Components

In the **components** folder, there is a subfolder called **modals**, containing three modals:

1. **Confirmation modal:** for confirming actions.
2. **Task history modal:** for viewing the task change history.
3. **Create/edit task modal:** for creating or editing tasks.

### Enums

In the **enums** folder, there are two enumerations:

1. **`task-priority.enum.ts`:** defines the values for task priority, which can be `low`, `medium` or `high`.
2. **`task-status.enum.ts`:** defines the values for task status, which can be `pending`, `in_progress` or `completed`.

### Interfaces

1. **`task-history.interface.ts`:** defines the structure of each item in task's `history` property.
2. **`task.interface.ts`:** defines the structure of a task.

### Pages

In the **pages** folder, you'll find the **tasks** page, which is the main view accessible via the defined route. This component is considered a
"page" because it can be accessed via a specific route, otherwise, would be stored in the **components** folder.

### Services

The **services** folder contains the following services:

1. **`alert.service.ts`:** responsible for showing the action confirmation modal.
2. **`api.service.ts`:** handles all HTTP requests to the API.
3. **`modal.service.ts`:** manages the display of modals.
4. **`toast.service.ts`:** displays success or error messages in **toast** format using **Angular Material**.

### Validators

In the **validators** folder, there is the **custom_validator.ts** file, which provides custom validators that can be used in reactive forms.

### The Tasks Component

The Tasks Component implements multiple components from Angular Material to create a good user experience:

- **MatSpinner:** to show a loading animation while the tasks are being fetched from the API.
- **MatTabGroup:** to show sections and show/hide content dynamically between them.
- **MatButton:** to show beautiful buttons.
- **MatFormField:** to show beautiful inputs, with value validation, error messages and hints. It also works with **MatInput**, **MatSelect** and **MatChip** to create/update/filter tasks.
- **MatTable:** to show tasks by using beautiful tables and also provide sorting, filtering and pagination feaures.
- **MatToolTip:** to show indicative messages over each icon button.
- **MatDatePicker:** to show a beautiful date selector and select `dueDate`.
- **MatTimePicker:** to show a beautiful time selector and select `dueDateTime`.

The tasks component also utilizes **Bootstrap** to handle responsiveness, but it only uses the **Bootstrap Grid**.

## Access to live deployed application

The application was deployed to production by using **AWS EC2** technology.

The application is accessible via IPV4: [http://3.129.207.112:4200](http://3.129.207.112:4200)

The image below shows the **AWS EC2** configuration:

![AWSWebScreenshot](/src/assets/img/aaamb-web-aws.png);
