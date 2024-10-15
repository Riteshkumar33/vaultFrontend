import {ethers} from "ethers"
import contractAbi from "../constants/contractAbi.json"
import toast from "react-hot-toast"
import axios from "axios"
export const connectWallet=async()=>{
   try {
      if(!window.ethereum){
         throw new Error("Metamask is not installed")
     
      }
      const accounts=await window.ethereum.request({
         method:"eth_requestAccounts"
      })
      const selectedAccount=accounts[0];
      console.log(selectedAccount)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer= await provider.getSigner();
      const message="Welcome to Crypto Vault Website";
      const signature=await signer.signMessage(message);
      
      const dataSignature={
         signature
      }
      const url=`https://vaultbackend-7ztw.onrender.com/api/authentication?address=${selectedAccount}`
      const res=await axios.post(url,dataSignature)
      const token=res.data.token
      localStorage.setItem("token",token)

      
      const contractAddress="0xb38147c39592199bCCE1B3e325A32cC3c2F845E7"
      const contractInstance=new ethers.Contract(contractAddress,contractAbi,signer);
      return {contractInstance,selectedAccount}
   } catch (error) {
      toast.error("Wallet connection failed")
      console.error(error)
   }
 
}