import styled from '@emotion/styled';
import { Pagination, PaginationItem } from '@mui/material';
import { DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';

const HistoryTable = ({ history }) => {

    const PAGE_SIZE = 4;
    const [paginationModel, setPaginationModel] = useState({
        pageSize: PAGE_SIZE,
        page: 0,
    });

    function formatDate(inputDate) {
      const dateParts = inputDate.split(/[\s,]+/);
      const day = dateParts[1];
      const month = String(dateParts[2]).substring(0, 3)
      const year = dateParts[3];
      
      const timeParts = dateParts[4].split(':');

      return `${day} ${month} ${year}, ${timeParts[0]}${timeParts[1]} hrs`;
    
    }

    const [solvedRowIds, setSolvedRowIds] = useState([]);

    useEffect(() => {
        const updateSolvedIds = () => history["data"].forEach(el => {
            if (el["isSolved"]) {
                setSolvedRowIds(prev => [...prev, el["id"]])
            }
        });
        updateSolvedIds();
    }, [])

    function CustomPagination() {
        const apiRef = useGridApiContext();
        const page = useGridSelector(apiRef, gridPageSelector);
        const pageCount = useGridSelector(apiRef, gridPageCountSelector);
      
        return (
          <Pagination
            sx={{
                "& .MuiPaginationItem-root": {
                    color: "#fff"
                }
            }}
            variant="outlined"
            shape="rounded"
            page={page + 1}
            count={pageCount}
            renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
          />
        );
    }

    const StyledDataGrid = styled(DataGrid)(() => ({
        color: 'rgba(255,255,255,0.85)',
        WebkitFontSmoothing: 'auto',
        letterSpacing: 'normal',
        '& .MuiDataGrid-columnsContainer': {
          backgroundColor: '#1d1d1d',
        },
        '& .MuiDataGrid-iconSeparator': {
          display: 'none',
        },
        '& .MuiDataGrid-columnHeader': {
            font: 'bold'
        },
        '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
          borderRight: '1px solid #303030',
        },
        '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
          borderBottom: '1px solid #303030',
        },
        '& .MuiDataGrid-cell, .MuiButtonBase-root': {
          color: 'rgba(255,255,255,0.65)',
        },
        '& .MuiPaginationItem-root': {
          borderRadius: 0,
        },
        '& .theme-header': {
          backgroundColor: '#404040'
        }
    }));

    const uniqueValuesMap = new Map();

    history["data"].map(entry => ({
        id: entry["id"],
        question: entry["questionTitle"],
        answeredAt: formatDate(entry["answeredAt"]),
        isSolved: entry["isSolved"],
        roomId: entry["roomId"],
        complexity: entry["complexity"]
    })).forEach(item => {
      const key = `${item.isSolved}_${item.roomId}_${item.question}`;
      if (!uniqueValuesMap.has(key) || item.id > uniqueValuesMap.get(key).id) {
          uniqueValuesMap.set(key, item);
      }
    });

    const rows = Array.from(uniqueValuesMap.values());

    const columns = [
        { field: 'question', headerName: 'QUESTION', headerClassName: 'theme-header', headerAlign: 'center', disableColumnMenu: true, flex: 0.4},
        { field: 'answeredAt', headerName: 'DATE', headerClassName: 'theme-header', headerAlign: 'center', align: 'center', disableColumnMenu: true, flex: 0.3},
        { field: 'isSolved', headerName: 'SOLVED', headerClassName: 'theme-header', align: 'center', type: 'boolean', disableColumnMenu: true, flex: 0.1,
            renderCell: (params) => solvedRowIds.includes(params.id)
                ? <CheckIcon sx={{ color: '#008000' }} />
                : <ClearIcon sx={{ color: '#EE4B2B' }} />
        },
        { field: 'complexity', headerName: 'COMPLEXITY', headerClassName: 'theme-header', headerAlign: 'center', align: 'center', disableColumnMenu: true, flex: 0.2 }
    ]

    return (
        <div style={{
            width: '95%',
            marginLeft: 'auto',
            marginRight: 'auto',
            color: '#FFFFFF',
            paddingBottom: 5
        }}>
          <StyledDataGrid
              rows={rows}
              columns={columns}
              paginationModel={paginationModel}
              pageSizeOptions={[PAGE_SIZE]}
              onPaginationModelChange={setPaginationModel}
              slots={{
                  pagination: CustomPagination
          }}/>
        </div>
    )
};

export default HistoryTable;