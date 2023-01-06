import express from 'express';
import utils from './utils.js';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
const DELAY = 15000; // Delay between frames in ms
const TEMP_MIN = 150; // Minimum temperature °C x 10
const TEMP_MAX = 300; // Maximum temperature °C x 10

const token = "sgemtWFXyR2YbgEnHnVa3aFhCcGiQGYKrUSNogBgkuk2XQpZecATRzOpy5S0PhBglWS7nzJDvqyWrFRkgAxlAA==";

const url = 'http://localhost:8086/'

const client = new InfluxDB({url, token})
let org = `Open IT`
let bucket = `TP_malik`

let writeClient = client.getWriteApi(org, bucket, 'ns')
const app = express();
app.listen(8080, () => console.log("port 8080"));

function start() {
const temperature = utils.randomNumber(TEMP_MIN, TEMP_MAX);
  
  let point = new Point('measurement1')
    .tag('tagname1', 'tagvalue1')
    .intField('temperature', temperature/10)

  void setTimeout(() => {
    writeClient.writePoint(point)
  }, 1 * 15000) // separate points by 1 second

  void setTimeout(() => {
    writeClient.flush()
  }, 5000)
  
}

let queryClient = client.getQueryApi(org)
let fluxQuery = `from(bucket: "TP_malik")
 |> range(start: -10m)
 |> filter(fn: (r) => r._measurement == "measurement1")`

queryClient.queryRows(fluxQuery, {
  next: (row, tableMeta) => {
    const tableObject = tableMeta.toObject(row)
    console.log(tableObject)
  },
  error: (error) => {
    console.error('\nError', error)
  },
  complete: () => {
    console.log('\nSuccess')
  },
})
queryClient = client.getQueryApi(org)
fluxQuery = `from(bucket: "TP_malik")
 |> range(start: -10m)
 |> filter(fn: (r) => r._measurement == "measurement1")
 |> mean()`

queryClient.queryRows(fluxQuery, {
  next: (row, tableMeta) => {
    const tableObject = tableMeta.toObject(row)
    console.log(tableObject)
  },
  error: (error) => {
    console.error('\nError', error)
  },
  complete: () => {
    console.log('\nSuccess')
  },
})
function start2() {
	//Generate random value and convert it into hexadecimal
	const humidity = utils.randomNumber(TEMP_MIN, TEMP_MAX);

  let point = new Point('measurement1')
    .tag('tagname1', 'tagvalue1')
    .intField('humidity', humidity/15)

  void setTimeout(() => {
    writeClient.writePoint(point)
  }, 1 * 15000) // separate points by 1 second

  void setTimeout(() => {
    writeClient.flush()
  }, 5000)}
setInterval(() => start(), DELAY);
setInterval(() => start2(), DELAY);
