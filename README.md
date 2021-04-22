# emt-desktop

[![Netlify Status](https://api.netlify.com/api/v1/badges/7945b3db-d54f-4596-9413-8cca06d4448f/deploy-status)](https://app.netlify.com/sites/nashoba-ems-scheduler/deploys) [![Validation](https://github.com/Nashoba-EMS/emt-desktop/actions/workflows/validation.yml/badge.svg)](https://github.com/Nashoba-EMS/emt-desktop/actions/workflows/validation.yml) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/jtaylorchang/emt-desktop.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/jtaylorchang/emt-desktop/context:javascript) [![Lines of Code](https://tokei.rs/b1/github/jtaylorchang/emt-desktop)](https://github.com/jtaylorchang/emt-desktop)

## Setup

- Run `yarn install`
- Create `.env.production.local` file:

```
REACT_APP_API_URL="<API_URL>"
```

## Deploying

- Run `yarn deploy`
- Follow netlify directions for deploying

## Running Offline

- Start the `emt-backend`
- Run `yarn start`

## Features and screenshots

- Admins can create a schedule for a given range of days (typically one month). Admins can remove days that shouldn't have crews, for instance if there are vacation days in the month. Once a schedule has been created, each cadet can fill in their availability for the period:

![Availability](.readme/availability.png)

- After all the cadets have input their availability, an admin can automatically generate a schedule that is compliant with state guidelines and is as fair as possible:

![Schedules](.readme/schedule-builder.png)

- When using a rotating crew schedule instead of a per-day schedule, admins can assemble crews using the drag-and-drop crew builder:

![Crews](.readme/crew-builder.png)

- Admins can create and manage cadet accounts to do things like reset their passwords or change their status as certified or as a chief:

![Cadets](.readme/cadet.png)

## License

`@nashoba-ems/emt-desktop` is [BSD-3-Clause licensed](./LICENSE)
