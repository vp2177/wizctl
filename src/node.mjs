#! 

import process from 'node:process'
import {wizctl} from './wiz.mjs'

wizctl(process.argv.slice(2))
