import express from 'express'
import { createServer } from 'node:http'
import * as lowdb from 'lowdb/node'
import path from 'path'
import url from 'url'
import cors from 'cors'
import { v4 } from 'uuid'

const app = express();
app.use(cors())
app.use(express.json({

}))

const server = createServer(app);

const dirname = url.fileURLToPath(new URL('.', import.meta.url));


const db = await lowdb.JSONFilePreset(path.join(dirname, '../data/projects.json'), {
    projects: []
});
await db.read()

let doSchema = async () => {
    await db.read()
    db.data.projects = db.data.projects || []
}
await doSchema()

app.get('/', async (req, res) => {
    res.json({
        message: 'yo'
    })
});

app.post('/new-project', async (req, res) => {
    await db.read()
    let newData = {
        name: 'App ' + db.data.projects.length,
        slug: v4(),
    }

    await doSchema()
    db.data.projects.push(newData)

    await db.write()
    await db.read()

    res.json(newData)
})

app.get('/all-data', async (req, res) => {
    await db.read()

    await doSchema()
    if (db.data.projects.length === 0) {
        db.data.projects.push({
            name: 'App ' + db.data.projects.length,
            slug: v4(),
        })
    }
    await db.write()
    await db.read()

    res.json(db.data)
});

server.listen(8390, () => {
    console.log('server running at http://localhost:8390')
});

// 