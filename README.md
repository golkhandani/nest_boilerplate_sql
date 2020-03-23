# Nest Boilerplate project 
## WIP: subtitle
###### WIP: description


## Branches
|Name| Description |
| -- | ------ |
| master | Main code for production environment |
| staging | For stablity testing (weekly update) |
| dev | For development purposes |
| dev-{feature}-#{taskNumber} | For new features (they will be merged into dev branch) |



# Project structure
###### Based on Nest.js Folder structure
> baham logics folders will be added after a more detailed look

    .📦backend
    ├──📦src                      # Main Codes of Application
    |   ├──📂constants            # All the constants  
    |   ├──📂services             # Project Specific structure
    |   |   ├──📂authenticaton    # Authentication Logics
    |   |   ├──📂authorizaton     # Authorization Logics
    |   |   └── ...
    |   |   ├──📂notificaton      # Notification Logics
    |   |   ├──📂profiles         # Users Logics
    |   ├──📂shared               # Shared file like interceptors/helpers/logger/etc.
    |   ├────📜app.module.ts      # App starter module
    |   ├────📜main.ts            # App starter bootstrap
    ├──📂test                     # Test files (alternatively `spec`) 
    ├────📜package.json
    ├────📜Dockerfile 
    ├────📜tsconfig.json 
    ├────📜development.env        # enviroments file for local development 
    └── ...

# Project database Collections
###### We are in early stage so there will be another collections for persist data
| Collection | Description |
| - | - |
| Users | فهرست کاربران و پروفایل هاشون |
| Auth_phone_verifications | برای هندل کردن سیستم لاگین |
| Auth_refresh_tokens | برای هندل کردن سیستم رفرش jwt |
| Auth_user_scopes | برای هندل کردن سطوح مختلف دسترسی |
| Media_items | فهرست کامل همه فایل های چند رسانه ای برای تمامی کالکشن ها |
| Notification_messages | فهرست پیام های فرستاده شده از طریق نوتیفیکشن سیستم |
| Notification_players | روشهای ارتباطی با کاربران شامل ایدی پوش یا ... |
|
# Project endpoints list 
#### These are just endpoint more detail will be added to swagger files
`var baseUrl = api/v1/`
##### Authentication

|Endpoint|Description|
| - | - |
| POST `authentication/signup/phone` | - |
| POST `authentication/signin/phone` | - |
| POST `authentication/refresh` | - |


##### Users
|Endpoint|Description|
| - | - |
| GET `users/self` | - |
| PUT `users/self` | - |
| PUT `users/self/picture` | - |
| DELETE `users/self/picture` | - |
