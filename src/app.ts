

var concurrencyMax = 4 // I moved it from parameters to global scope because I need to change it externally without calling the function again
var numberOfTasks = 20

/**
 * Just a delay function
 * @param ms milliseconds to wait
 * @returns 
 */
const delay = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generates a list of tasks 
 * Each task is a random string of length between 3 and 10
 * @param numberOfTasks number of tasks to generate
 * @returns
 */
const generateTaskList = (numberOfTasks: number) => [...Array(numberOfTasks)].map(() => [...Array(~~(Math.random() * 10 + 3))].map(() => String.fromCharCode(Math.random() * (123 - 97) + 97)).join(''))

/**
 * Here we do the task
 * @param taskName 
 * @returns 
 */
var doTask = (taskName: string) => {
    var begin = Date.now()
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            var end = Date.now()
            var timeSpent = (end - begin) + "ms"
            console.log('\x1b[36m', "[TASK] FINISHED: " + taskName + " in " +
                timeSpent, '\x1b[0m')
            resolve(true)
        }, (Math.random() * 2000 + 1000))
    })
}

/**
 * Initializes the program
 */
async function init() {
    const numberOfTasks = 20
    const taskList = generateTaskList(numberOfTasks)

    console.log("[init] Concurrency Algo Testing...")
    console.log("[init] Tasks to process: ", taskList.length)
    console.log("[init] Task list: " + taskList)
    console.log("[init] Maximum Concurrency: ", concurrencyMax, "\n")

    // simulate external change concurrencyMax
    delay(6000).then(() => {
        concurrencyMax = 2
        console.log(`**** changing concurrencyMax to ${concurrencyMax} ****`)
    })

    manageConcurrency(taskList)
}

/**
 * This is the main function that manages the concurrency of the tasks
 * 
 * @param taskList current tasts list
 */
const manageConcurrency = async (taskList: string[]) => {
    return await new Promise(async (resolve, reject) => {
        try {
            let concurrencyCurrent = 0
            let index = 0
            let tasksInProcess = 0
            
            const isPossibleToRunTask = () => concurrencyCurrent < concurrencyMax

            const onTaskCompleted = () => {
                concurrencyCurrent--
                tasksInProcess--
                if (index == taskList.length && tasksInProcess == 0) {
                    console.log("All tasks successfully completed")
                    resolve(null)
                }
            }

            for (index;index < taskList.length;index++) {
                if (isPossibleToRunTask()) {
                    const task = taskList[index]

                    // logs
                    console.log(`Concurrency: ${concurrencyCurrent} of ${concurrencyMax}`)
                    console.log(`Task count: ${index} of ${taskList.length}`)
                    console.log('\x1B[31m', "[TASK] STARTING: " + task, '\x1b[0m')

                    concurrencyCurrent++
                    tasksInProcess++
                    doTask(task).then(onTaskCompleted)
                }
                else {
                    await delay(100)
                    index--
                }
            }
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(`Error: ${err.name} — ${err.message}`)
            } 
            reject(err)
        }
    })
}

init()

