// style.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'flex-end',
  },
  display: {
    fontSize: 60,
    color: '#000',
    textAlign: 'right',
    marginRight: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    fontSize: 30,
    color: '#000',
  },
  operatorButton: {
    backgroundColor: '#f4a300',
  },
  operatorText: {
    color: '#fff',
    fontSize: 30,
  },
});
