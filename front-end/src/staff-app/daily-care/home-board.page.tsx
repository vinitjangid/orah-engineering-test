import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { faHandLizard } from "@fortawesome/free-solid-svg-icons"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [sortType, setSortType] = useState("null")
  const [reverse, setReverse] = useState(1)
  const [filteredArray, setFilteredArray] = useState([])

  useEffect(() => {
    void getStudents()
    //setSortType('intial')
  }, [getStudents])

  

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
      console.log(data?.students)
    }
    else if (action === 'sort') {
      setSortType("sort")
      const soretdByFirstName = data?.students?.sort((a, b) => a.first_name > b.first_name ? 1 : -1)
      setFilteredArray(soretdByFirstName)
      setReverse(1)
    }
    else if (action === 'reverse') {
      if (filteredArray?.length > 0) {
        setReverse(-1)
        filteredArray?.reverse()
      } else {
        setFilteredArray(data?.students)
      }
    }
    else if (action === 'last') {
      setSortType("last")
      const sortedByLastName = data?.students?.sort((a, b) => a.last_name > b.last_name ? 1 : -1)
      setFilteredArray(sortedByLastName)
      setReverse(1)
    } else {
      setSortType("search")
      const searchInput = action.toLowerCase()
      const filter = data?.students.filter(name => name.first_name.toLowerCase().includes(searchInput))
      setFilteredArray(filter)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    } 
    else if (action === "complete" ) {
      setIsRollMode(false)
    }
  }

  return (
    <>
      <S.PageContainer>.
        <Toolbar onItemClick={onToolbarAction} />
        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
            {sortType !== "null" ?
              filteredArray?.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            )) 
            :
            data?.students.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            )) 
            }
          </>
        )} 

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort" | "reverse" | "last" 
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  onClick: (action: ToolbarAction, value?: string) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick } = props

  return (
    <S.ToolbarContainer>
      <div >
        <button onClick={() => onItemClick("sort")}>
          First Name
        </button>
        <button onClick={() => onItemClick("reverse")}>
        ↓↑
        </button>
        <button onClick={() => onItemClick("last")}>
          Last Name
        </button>
        <button onClick={() => onItemClick("reverse")}>
        ↓↑
        </button>
      </div>
      <div>
        <input placeholder="Search" onChange={(e) => onItemClick(e.target.value)}>
        </input>
      </div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
