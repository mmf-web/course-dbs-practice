import fs from 'fs'

/**
 * @type {Array<{name: string, description: string, run: (db: import('promised-sqlite3').AsyncDatabase, args: string[]) => Promise<string>}>}
 */
export const commands = [
  {
    name: 'generate_random_expenses',
    description: 'Сгенерировать 100 случайных расходов',
    run: async (db, args) => {
      const categories = ['food', 'transport', 'entertainment', 'other']
      const DAY = 1000 * 60 * 60 * 24

      let query = []
      const data = []
      for (let i = 0; i < 100; i++) {
        query.push(`(?, ?, ?, ?)`)
        data.push(
          (Math.random() * 1000).toFixed(2),
          categories[Math.floor(Math.random() * categories.length)],
          'Тестовый расход ' + i,
          new Date(Date.now() - Math.floor(Math.random() * 5 * DAY)).toISOString()
        )
      }

      const sql = `INSERT INTO expenses (amount, category, description, created_at) VALUES ` + query.join(',')
      await db.run(sql, data)
      return 'OK'
    },
  },
  {
    name: 'add',
    description: 'Добавить расход (сумма, категория, описание)',
    run: async (db, args) => {
      const sql = fs.readFileSync('./sql/01_add_expense.sql', 'utf8').trim()
      const [amount, category, ...descriptions] = args
      await db.run(sql, [amount, category, descriptions.join(' ')])
      return 'OK'
    },
  },
  {
    name: 'all_expenses',
    description: 'Показать все записи расходов',
    run: async (db, args) => {
      const sql = fs.readFileSync('./sql/02_get_all_expenses.sql', 'utf8').trim()
      return JSON.stringify(await db.all(sql, []), null, 2)
    },
  },
  {
    name: 'total',
    description: 'Показать общую сумму расходов',
    run: async (db, args) => {
      const sql = fs.readFileSync('./sql/03_total.sql', 'utf8').trim()
      return JSON.stringify(await db.get(sql, []), null, 2)
    },
  },
  {
    name: 'categories',
    description: 'Показать все категории',
    run: async (db, args) => {
      const sql = fs.readFileSync('./sql/04_distinct_categories.sql', 'utf8').trim()
      return JSON.stringify(await db.all(sql, []), null, 2)
    },
  },
  {
    name: 'stats_by_category',
    description: 'Показать сумму расходов и их количество по каждой категории',
    run: async (db, args) => {
      const sql = fs.readFileSync('./sql/05_stats_by_category.sql', 'utf8').trim()
      return JSON.stringify(await db.all(sql, args), null, 2)
    },
  },
  {
    name: 'drop_expenses',
    description: 'Удалить все записи расходов',
    run: async (db, args) => {
      const sql = fs.readFileSync('./sql/06_drop_expenses.sql', 'utf8').trim()
      await db.run(sql, [])
      return 'OK'
    },
  },
  {
    name: 'add_category',
    description: 'Добавить категорию',
    run: async (db, args) => {
      const sql = fs.readFileSync('./sql/07_add_category.sql', 'utf8').trim()
      const [name] = args
      await db.run(sql, [name])
      return 'OK'
    },
  },
]
