import { createInterface } from 'readline/promises'
import { getVMMiddleware } from '../computed'
import type { VMModule } from '../computed/interfaces'
import { ask } from '../gpt3'
import OpenWeatherAPI from 'openweather-api-node'
import type { Example } from '../gpt3/instructions'

const openWeather = new OpenWeatherAPI({
  // key: 'YOUR_API_KEY',
  // units: 'metric',
  // locationName: 'Stockholm, SE'
})

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

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
          human: 'What is the humidity?',
          ai: 'Humidity is {{ weather.humidity }}%.'
        },
        {
          human: 'What is the wind speed?',
          ai: 'Wind speed is {{ weather.wind.speed }} m/s.'
        },
        {
          human: 'What is the wind direction?',
          ai: 'Wind direction is {{ weather.wind.deg }}°.'
        },
        {
          human: "What's the temperature feels like?",
          ai: 'Temperature feels like {{ weather.feelsLike.cur }}°C.'
        },
        {
          human: "What's the weather?",
          ai: "It's {{ weather.description }} and temperature is {{ weather.temp.cur }}°C."
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
  { human: 'What is you name?', ai: 'My name is Ava.' }
]

while (true) {
  const input = await rl.question('input> ')

  const output = await ask(
    input,
    {
      context,
      examples
    },
    middlewares
  )

  console.log('output>', output)
}
