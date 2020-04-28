import { sortFormattedNames } from './fontsList'

test('sortFormattedNames sorts fonts by family name', () => {
  const list = [
    { family: 'C', style: 'regular' },
    { family: 'A', style: 'regular' },
    { family: 'B', style: 'italic' },
    { family: 'A', style: 'bold' }
  ]

  expect(list.sort(sortFormattedNames)).toEqual([
    { family: 'A', style: 'bold' }, 
    { family: 'A', style: 'regular' }, 
    { family: 'B', style: 'italic' }, 
    { family: 'C', style: 'regular' }, 
  ])
})
