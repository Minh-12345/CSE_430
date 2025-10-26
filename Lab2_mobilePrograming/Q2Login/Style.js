import { StyleSheet } from 'react-native';

const AppTheme = {
  colors: {
    primary: '#EF506B',
    border: '#ddd',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: AppTheme.colors.primary,
    marginBottom: 24,
    marginTop: 72,
  },
  input: {
    borderColor: AppTheme.colors.border,
    borderWidth: 1,
    width: '100%',
    marginTop: 12,
    borderRadius: 10,
    paddingLeft: 12,
    height: 48,
    fontSize: 16,
  },
  button: {
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default styles;
