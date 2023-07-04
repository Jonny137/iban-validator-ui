import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { Notifications, notifications } from '@mantine/notifications';
import { MantineProvider, Table, TextInput, Button } from '@mantine/core';

import './App.css';

const URL = 'http://localhost:8000/api/iban';

interface IIBan {
  id: string,
  iban: string,
  status: string,
  created_at: string
};

function App() {
  const [ibanVal, setIbanVal] = useState<string>('');
  const [ibans, setIbans] = useState<IIBan[]>([]);

  useEffect(() => {
    async function getIbans(): Promise<void> {
      try {
        const response = await axios.get(URL + '/tail');
        setIbans(response.data);
      } catch (error) {
        notifications.show({
          withCloseButton: true,
          autoClose: 2000,
          title: "IBAN Fetch Status",
          message: 'Fetching IBANs failed!',
          color: 'red',
          loading: false,
        });
      }
    }
    getIbans();
  }, [])
  
  async function handleClick(): Promise<void> {
    try {
      const response = await axios.post(URL, {"iban": ibanVal});
      setIbans([response.data, ...ibans]);
      setIbanVal('');
    } catch(error) {
      notifications.show({
        withCloseButton: true,
        autoClose: 2000,
        title: "IBAN Fetch Status",
        message: 'IBAN not valid for MNE!',
        color: 'red',
        loading: false,
      });
    }
  }

  return (
    <div className="wrapper">
      <MantineProvider>
        <Notifications />
        <h1>IBAN Validator</h1>
        <div className="iban-val">
          <TextInput
            placeholder="ME25 5050 0001 2345 6789 51"
            label="IBAN"
            value={ibanVal}
            onChange={(event) => setIbanVal(event.currentTarget.value)}
            className="iban-input"
          />
          <Button
            disabled={!ibanVal}
            onClick={handleClick}
          >
            Validate
          </Button>
        </div>
        <Table>
          <thead>
            <tr>
              <th>IBAN</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>{
            ibans.map((iban: IIBan) => (
              <tr key={iban.id}>
                <td>{iban.iban}</td>
                <td className={iban.status}>{iban.status}</td>
                <td>{dayjs(iban.created_at).format('DD.MM.YYYY. HH:MM:ss')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </MantineProvider>
    </div>
  );
}

export default App;
