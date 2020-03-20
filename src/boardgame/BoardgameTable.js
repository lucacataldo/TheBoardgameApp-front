import React, { useState, useEffect, useCallback } from "react";
import LoadingOverlay from "react-loading-overlay";
import { useTable, useFilters, usePagination } from "react-table";
import matchSorter from "match-sorter";
import { getBGCollection } from "./apiBoardgame";
import Alert from "../components/Alert";
// Define a default UI for filtering
const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter }
}) => {
  const count = preFilteredRows.length;

  return (
    <input
      className="form-control"
      value={filterValue || ""}
      onChange={e => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
};

const NumberSelectFilter = ({ column: { filterValue, setFilter } }) => {
  return (
    <select
      className="form-control"
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8+</option>
    </select>
  );
};
const PlayTimeSelectFilter = ({ column: { filterValue, setFilter } }) => {
  return (
    <select
      className="form-control"
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      <option value="30">30mins</option>
      <option value="45">45mins</option>
      <option value="60">60mins</option>
      <option value="90">90mins</option>
      <option value="180">180+mins</option>
    </select>
  );
};

const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
};

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val;

// Our table component
const Table = ({ columns, data }) => {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: {
        pageIndex: 0,
        hiddenColumns: ["minPlayers"]
      }
    },
    useFilters,
    usePagination
  );

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  //const firstPageRows = rows.slice(0, 10);

  return (
    <>
      <table className="table table-bordered" {...getTableProps()}>
        <thead className="thead-dark ">
          {headerGroups.map(headerGroup => (
            <tr className="align-top" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th className="align-top" {...column.getHeaderProps()}>
                  {column.render("Header")}
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td className="align-middle" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

// Define a custom filter filter function!

const filterCheck = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
};

const filterGreaterThan = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
};

const filterLessThan = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id];
    return filterValue <= rowValue;
  });
};
const filterLessThanMax = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id];
    return rowValue <= filterValue;
  });
};

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterCheck.autoRemove = val => typeof val !== "number";

const App = () => {
  const columns = React.useMemo(
    () => [
      {
        accessor: "imgThumbnail",
        Cell: ({ cell: { value } }) => (
          <img
            className="img-thumbnail"
            src={String(value)}
            alt={String(value)}
            style={{ maxWidth: "60px", maxHeight: "60px" }}
          />
        ),
        disableFilters: true
      },
      {
        Header: "Title",
        accessor: d => `${d.title} ${d.yearPublished}`,
        // Use our custom `fuzzyText` filter on this column
        filter: "fuzzyText",
        Cell: ({ row: { original } }) => {
          //console.log(original);
          return (
            <span>
              {String(original.title)} ({String(original.yearPublished)})
            </span>
          );
        }
      },
      {
        Header: "Rating",
        accessor: "avgRating",
        Cell: ({ cell: { value } }) => (
          <span>{Math.round(10 * String(value)) / 10}</span>
        ),
        Filter: NumberSelectFilter,
        filter: filterGreaterThan
      },
      {
        Header: "Players",
        accessor: "maxPlayers",
        Cell: ({ row: { original } }) => {
          //console.log(original);
          return (
            <span>
              {String(original.minPlayers)}-{String(original.maxPlayers)}
            </span>
          );
        },
        Filter: NumberSelectFilter,
        filter: filterLessThan
      },
      {
        Header: "Play Time",
        accessor: "maxPlayTime",
        Cell: ({ row: { original } }) => {
          //console.log(original);
          return (
            <span>
              {original.minPlayTime === original.maxPlayTime
                ? original.minPlayTime
                : String(original.minPlayTime) +
                  "-" +
                  String(original.maxPlayTime)}
            </span>
          );
        },
        Filter: PlayTimeSelectFilter,
        filter: filterLessThanMax
      }
    ],
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [data, setData] = useState([]);
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVisible, setAlertVible] = useState(false);

  const handleChange = ({ target }) => {
    console.log("here");
    setAlertVible(false);
    setUsername(target.value);
  };

  useEffect(() => {
    (async () => {
      await getBGCollection(username).then(data => {
        
        if (data !== undefined && !data.error) {
          setData(data);
        }
      });
    })();
  }, []);

  async function submitClick(event) {
    if (isLoading) return;
    setIsLoading(true);
    setAlertVible(false);
    await getBGCollection(username).then(data => {
      
      if (data !== undefined && !data.error) {
        setData(data);
      } else {
        setData([]);
        setAlertStatus("danger");
        setAlertMsg(
          "Unable to get user information, please check if username is valid"
        );
        setAlertVible(true);
      }
      setIsLoading(false);
    });
  }

  return (
    <>
      <Alert type={alertStatus} message={alertMsg} visible={alertVisible} />
      <LoadingOverlay
        active={isLoading}
        spinner
        styles={{
          spinner: base => ({
            ...base,
            width: "100px",
            "& svg circle": {
              stroke: "rgba(0,98,204,1)"
            }
          }),
          wrapper: {
            height: "100%"
          }
        }}
        text="Fetching Collection....."
      >
        <div className="container-fluid">
          <div className="row justify-content-center my-3">
            <div className="col-lg-10 text-center">
              <h2 className="header-font">BBG Collection Viewer</h2>
            </div>
            <div className="col-lg-10 text-center">
              <h6 className="header-font">*Please note that collection over 1000 will not work</h6>
            </div>
          </div>
          <div className="row justify-content-center my-3">
            <div className="col-lg-5 col-md-6">
              <div className="form-group row">
                <div className="col-12">
                  <div className="input-group ">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="BBG Username"
                      aria-label="Boardgamegeek Username"
                      aria-describedby="bbgNameBtn"
                      value={username}
                      onChange={handleChange}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-info"
                        type="button"
                        id="bbgNameBtn"
                        onClick={submitClick}
                      >
                        Enter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <Table columns={columns} data={data} />
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </>
  );
};

export default App;
