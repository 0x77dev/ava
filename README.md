# Ava

**Work in progress:** Based on the GPT-3 ([OpenAI API](https://beta.openai.com/docs/api-reference/introduction)) and uses JavaScript Virtual Machine with templating techniques to extend it's abilities. Probably this is the easiest way to create your own virtual assistant that can be extended using natural language and custom VM context.

## Why?

For fun and to learn more about GPT-3 and it's capabilities and use cases.

## Quick overview

```mermaid
flowchart LR
    A[Input] --> B[OpenAI API]
    B --> C[GPT-3 answer]
    C --> D[templating engine]
    D --> E[rendered output]
    E --> F[Result]
```

### Weather example

You can take a look at the code here: [`examples/cli.ts`](examples/cli.ts)

```typescript
const vmModules: VMModule[] = [
  {
    id: 'weather',
    gpt3: {
      context: [
        '{{ weather }} variable is available in the context, it contains today weather forecast from openweathermap.'
      ],
      examples: [
        {
          human: 'What is the temperature?',
          ai: 'Temperature is {{ weather.temp.cur }}°C.'
        },
        {
          human: "What's the temperature feels like?",
          ai: 'Temperature feels like {{ weather.feelsLike.cur }}°C.'
        },
        {
          human: 'What is the wind speed?',
          ai: 'Wind speed is {{ weather.wind.speed }} m/s.'
        }
      ]
    },
    vm: {
      context: {
        weather: (await openWeather.getCurrent()).weather
      }
    }
  }
]

const middlewares = [getVMMiddleware(vmModules)]

const context = ['Your name is Ava.']

const examples: Example[] = [
  { human: 'What is your name?', ai: 'My name is Ava.' }
]
```

Let's try it:

```typescript
const output = await ask(
  "Hey! What's your name? What's the temperature feels like outside? Also can you tell me wind speed in km/h",
  {
    context,
    examples
  },
  middlewares
)

console.log(output)
```

AI Output:

```javascript
Hi there! My name is Ava. Temperature feels like {{ weather.feelsLike.cur }}°C. Wind speed is {{ (weather.wind.speed * 3.495).toFixed(2) }} km/h.
```

✨ _GPT-3 provided template with m/s to km/h conversion, for example you can add middleware asking GPT-3 to convert all of the measuring systems to user country native ones._ ✨

Rendered output:

```text
Hi there! My name is Ava. Temperature feels like 0.21°C. Wind speed is 10.79 km/h.
```

## TODO

- [ ] Add more examples like weather
- [ ] Add adapters for other platforms (Telegram, Discord, Slack, etc.)
- [ ] Create a web interface
  - [ ] Create an documentation using Docus
- [ ] Ship in a Docker container
- [ ] Add conversation history store and context for GPT-3.0
- [ ] Add multi language support (DeepL API middleware)
- [ ] Add user profiles and user groups
  - [ ] RBAC on top of groups and limit VM/GPT-3 context based on user group
- [ ] Allow user to add custom extensions and personalize Ava

## Legal

This project is not affiliated with OpenAI in any way.

[Licensed under GPL-3.0](LICENSE): feel free to use code in your projects, but please provide a link to [this repository](https://github.com/0x77dev/ava).

Copyright © 2023 Mykhailo Marynenko <mykhailo@0x77.dev>
