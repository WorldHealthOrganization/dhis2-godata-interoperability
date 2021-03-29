
import * as R from 'ramda'

import { allPromises } from '../util'

// Loads tracked entity instances related to an organisation unit and a program
export async function loadTrackedEntityInstances (dhis2, organisationUnits, programID) {
  const trackedEntities = await allPromises(
    R.map(async ou => {
      const trackedEntityInstances = await dhis2.getTrackedEntityInstances(ou.id, { program: programID })
      
      return allPromises(R.pipe(
        R.filter(_ => _ != null),
        R.map(async te =>
          R.assoc('events', await dhis2.getTrackedEntityEvents(te.trackedEntityInstance), te))
        )(trackedEntityInstances))
    }, organisationUnits)
  )
  return R.flatten(trackedEntities)
}

export async function loadCases (godata, outbreaks) {
  const cases = await allPromises(
    R.map(async outbreak => {
      return await godata.getOutbreakCases(outbreak.id)
    }, outbreaks)
  )
  return R.flatten(cases)
}
