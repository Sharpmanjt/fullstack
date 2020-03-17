import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

export default class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    }
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        data: this.props.data
      });
    }
  }

  render() {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {this.props.tableColumns.map(column => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.data.map(row => (
              <TableRow key={row.name}>
                {Object.keys(row).map(key => (
                  <TableCell key={key}>{row[key]}</TableCell>
                ))}
                {this.props.showRoomTable ? (
                  <TableCell key="edit">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => this.props.openDialog(row)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                ) : (
                  <TableCell></TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
