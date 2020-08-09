import React, { Component } from "react"
import "./App.css"
import logo from "./img/logoB.png"
import discordIcon from "./img/discord-icon.svg"
import { Route } from "react-router-dom"
import data from "./data/releaseData"
import SeriesList from "./SeriesList"
import SeriesModal from "./SeriesModal"
import MdFilterList from "react-icons/lib/md/filter-list"
import MdSearch from "react-icons/lib/md/search"
import MdSort from "react-icons/lib/md/sort"
import MdMoreVert from "react-icons/lib/md/more-vert"
import Dropdown from "./Dropdown"
import DropdownItem from "./DropdownItem"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: "start",
      data: data.list,
      dataSet: data.list,
      filter: "All",
      sort: "Date",
      showModal: {
        position: "fixed",
        visibility: "hidden",
      },
      noscroll: {
        height: "100%",
        overflowY: "auto",
      },
      modalSelection: "",
    }

    this.handleFilter = this.handleFilter.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  componentWillMount() {
    this.setState(prevState => {
      prevState.data = prevState.data.sort((a, b) => {
        if (a.updated.getTime() < b.updated.getTime()) return 1
        else if (a.updated.getTime() > b.updated.getTime()) return -1
        else return 0
      })
    })
  }

  handleFilter(e) {
    let value = e.currentTarget.attributes.value.value
    let name = e.currentTarget.attributes.name.value

    this.setState(prevState => {
      switch (name) {
        case "sort":
          prevState.sort = value
          break
        case "filter":
          prevState.filter = value
          break
        default:
      }

      let dataTemp = null
      switch (value) {
        case "All":
          prevState.data = data.list
          prevState.dataSet = data.list
          break
        case "Current":
          dataTemp = data.list.filter(e => {
            if (e.completed === undefined) return true
            else return false
          })
          prevState.data = dataTemp
          prevState.dataSet = dataTemp
          break
        case "Complete":
          dataTemp = data.list.filter(e => {
            return e.completed !== undefined && e.completed
          })
          prevState.data = dataTemp
          prevState.dataSet = dataTemp
          break
        case "Dropped":
          dataTemp = data.list.filter(e => {
            return e.completed !== undefined && !e.completed
          })
          prevState.data = dataTemp
          prevState.dataSet = dataTemp
          break
        case "Date":
          dataTemp = prevState.data.sort((a, b) => {
            if (a.updated.getTime() < b.updated.getTime()) return 1
            else if (a.updated.getTime() > b.updated.getTime()) return -1
            else return 0
          })
          prevState.data = dataTemp
          prevState.dataSet = dataTemp
          break
        case "Alphabetical":
          dataTemp = prevState.data.sort((a, b) => {
            if (a.title < b.title) {
              return -1
            }
            if (a.title > b.title) {
              return 1
            }
            return 0
          })
          prevState.data = dataTemp
          prevState.dataSet = dataTemp
          break
        default:
      }
    })
  }

  handleSearch(e) {
    let value = e.target.value.toLowerCase()
    this.setState(prevState => {
      if (value.length === 0) {
        prevState.data = prevState.dataSet
      } else {
        prevState.data = prevState.dataSet.filter(e => {
          return e.title.toLowerCase().includes(value)
        })
      }
    })
  }

  render() {
    return (
      <div>
        <Route
          path="/r/:series"
          render={props => <SeriesModal {...props} likes={this.state.likes} />}
        />
        <nav>
          <div className="nav-container">
            <div className="logo-container">
              <img src={logo} className="logo" alt="logo" />
            </div>

            <div className="filter-container">
              <div className="search">
                <MdSearch
                  size={24}
                  style={{ marginBottom: "2px", marginRight: "0.3rem" }}
                />
                <input type="search" onChange={this.handleSearch} />
              </div>
              <div className="filterBy">
                <Dropdown
                  attach={
                    <div>
                      <MdFilterList size={24} style={{ marginBottom: "2px" }} />{" "}
                      <small>FILTER BY</small>
                    </div>
                  }
                >
                  {["All", "Current", "Complete", "Dropped"].map(e => (
                    <DropdownItem
                      key={e}
                      name={"filter"}
                      icon={<MdFilterList size={16} />}
                      selection={this.state.filter}
                      text={e}
                      handle={this.handleFilter}
                    />
                  ))}
                </Dropdown>
              </div>
              <div className="sortBy">
                <Dropdown
                  attach={
                    <div>
                      <MdSort size={24} style={{ marginBottom: "2px" }} />{" "}
                      <small>SORT BY</small>
                    </div>
                  }
                >
                  {["Date", "Alphabetical"].map(e => (
                    <DropdownItem
                      key={e}
                      name={"sort"}
                      icon={<MdSort size={16} />}
                      selection={this.state.sort}
                      text={e}
                      handle={this.handleFilter}
                    />
                  ))}
                </Dropdown>
              </div>

              <div className="more">
                <Dropdown
                  attach={
                    <MdMoreVert size={24} style={{ marginBottom: "2px" }} />
                  }
                >
                  <div>
                    <a href="https://discord.gg/CnZBudA">
                      <DropdownItem
                        icon={
                          <img
                            style={{
                              height: "1.4rem",
                              verticalAlign: "middle",
                            }}
                            src={discordIcon}
                            alt="discord logo"
                          />
                        }
                        text={"Discord"}
                      />
                    </a>
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
        </nav>
        <div className="wrapper">
          <div className="serieslist-container">
            <div className="serieslist">
              <SeriesList
                title=""
                handler={this.handleSeriesItem}
                list={this.state.data}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
